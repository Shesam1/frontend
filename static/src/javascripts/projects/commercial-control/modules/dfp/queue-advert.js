// @flow

import { dfpEnv } from 'commercial-control/modules/dfp/dfp-env';
import { Advert } from 'commercial-control/modules/dfp/Advert';

const queueAdvert = (advert: Advert) => {
    dfpEnv.advertsToLoad.push(advert);
    // Add to the array of ads to be refreshed (when the breakpoint changes)
    // only if its `data-refresh` attribute isn't set to false.
    if (advert.node.getAttribute('data-refresh') !== 'false') {
        dfpEnv.advertsToRefresh.push(advert);
    }
};

export default queueAdvert;
