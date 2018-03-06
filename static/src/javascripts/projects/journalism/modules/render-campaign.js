// @flow
import fastdom from 'lib/fastdom-promise';
import template from 'lodash/utilities/template';
import campaignForm from 'raw-loader!journalism/views/campaignForm.html';
import { init as initCampaign } from 'journalism/modules/get-campaign';
import { submitForm } from 'journalism/modules/submit-form';

const makeCampaign = (anchorNode: HTMLElement): void => {
    const campaign = template(campaignForm, { data: initCampaign() });
    const campaignDiv = `<figure class="element element-campaign">${
        campaign
    }</figure>`;

    fastdom
        .write(() => {
            anchorNode.insertAdjacentHTML('afterend', campaignDiv);
        })
        .then(() => {
            const cForm = document.querySelector('.campaign form');

            if (cForm) {
                cForm.addEventListener('submit', e => {
                    submitForm(e);
                });
            }
        });
};

export const renderCampaign = () => {
    const fourthParagraph = document.querySelectorAll(
        '.content__article-body p'
    )[4];
    if (fourthParagraph) makeCampaign(fourthParagraph);
};
