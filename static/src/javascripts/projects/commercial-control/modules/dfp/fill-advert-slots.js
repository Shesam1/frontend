// @flow

import qwery from 'qwery';
import { dfpEnv } from 'commercial-control/modules/dfp/dfp-env';
import { Advert } from 'commercial-control/modules/dfp/Advert';
import queueAdvert from 'commercial-control/modules/dfp/queue-advert';
import { displayLazyAds } from 'commercial-control/modules/dfp/display-lazy-ads';
import { displayAds } from 'commercial-control/modules/dfp/display-ads';
import { setupSonobi } from 'commercial-control/modules/dfp/prepare-sonobi-tag';
import { closeDisabledSlots } from 'commercial-control/modules/close-disabled-slots';

// Pre-rendered ad slots that were rendered on the page by the server are collected here.
// For dynamic ad slots that are created at js-runtime, see:
//  article-aside-adverts
//  article-body-adverts
//  liveblog-adverts
//  high-merch
const fillAdvertSlots = (): Promise<void> => {
    // This module has the following strict dependencies. These dependencies must be
    // fulfilled before fillAdvertSlots can execute reliably. The bootstrap (commercial.js)
    // initiates these dependencies, to speed up the init process. Bootstrap also captures the module performance.
    const dependencies: Promise<void>[] = [setupSonobi(), closeDisabledSlots()];

    return Promise.all(dependencies).then(() => {
        // Get all ad slots
        const adverts = qwery(dfpEnv.adSlotSelector)
            .filter(adSlot => !(adSlot.id in dfpEnv.advertIds))
            .map(adSlot => new Advert(adSlot));
        const currentLength = dfpEnv.adverts.length;
        dfpEnv.adverts = dfpEnv.adverts.concat(adverts);
        adverts.forEach((advert, index) => {
            dfpEnv.advertIds[advert.id] = currentLength + index;
        });
        adverts.forEach(queueAdvert);

        if (dfpEnv.shouldLazyLoad()) {
            displayLazyAds();
        } else {
            displayAds();
        }
    });
};

export { fillAdvertSlots };
