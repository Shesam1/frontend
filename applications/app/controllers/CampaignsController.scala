package controllers

import conf.Configuration
import common._
import model._
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Json

import scala.concurrent._

class CampaignsController(
  val controllerComponents: ControllerComponents,
  val wsClient: WSClient,
)(implicit context: ApplicationContext)
  extends BaseController with ImplicitControllerExecutionContext with Logging {

  val root = Configuration.formstack.url + "/form/"
  val endpoint = "/submission.json"
  val token = Configuration.formstack.editorial.oAuthToken

  def formSubmit() = Action.async { implicit request: Request[AnyContent] =>

    println("-----------")
    println(request.body)

    val formId: String = request.body.asFormUrlEncoded.map(formData => formData("formId")).get.last
    val pageUrl: String = request.headers("referer")

    val jsonBody: Option[JsValue] = request.body.asFormUrlEncoded.map( formData => {
      val keysMinusFormId = formData.keys.filter(_ != "formId")
      val formattedData = keysMinusFormId.foldLeft(Map.empty[String, String])((map, key) => {
        val formValue: Option[String] = formData get key map(_.last)
        map + (key -> formValue.get)
      })
      Json.toJson(formattedData)
    })

    jsonBody.map { json =>
      sendToFormstack(json, formId).flatMap { res =>
        println(res)
        if(res.status == 201) {
          Future.successful(Redirect(pageUrl)) // why are parameters illegal?
        }
        else {
          Future.failed( new Throwable("Sorry your story couldn't be sent"))}
      }

    }.getOrElse{
      Future.failed( new Throwable("Sorry no data was sent"))
    }
  }

  def sendToFormstack(data: JsValue, formId: String): Future[WSResponse] = {
    wsClient.url(root + formId + endpoint).withHttpHeaders(
      "Authorization" -> s"Bearer $token",
      "Accept" -> "application/json",
      "Content-Type" -> "application/json"
    ).post(data)
  }

}
