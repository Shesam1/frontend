// @flow
import config from 'lib/config';

export const init = () => {
    // eslint-disable-next-line
    const isCallout = campaign => campaign.fields._type === 'callout';
    const allCampaigns = config.get('page.campaigns');

    // targeting should become better once the campaigns tool works
    const allCallouts = allCampaigns.filter(isCallout);
    const campaignToShow = allCallouts.shift();

    return {
        title: campaignToShow.fields.callout,
        description: campaignToShow.fields.description,
        formFields: campaignToShow.fields.formFields,
        formId: campaignToShow.fields.formId,
    };
};
