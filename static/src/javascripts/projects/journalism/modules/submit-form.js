// @flow
import fastdom from 'lib/fastdom-promise';
import fetch from 'lib/fetch';

const formToJSON = elements =>
    [].reduce.call(
        elements,
        (data, element) => {
            data[element.name] = element.value;
            return data;
        },
        {}
    );

const showConfirmation = cForm => {
    fastdom.write(() => {
        cForm.textContent = 'Thank you for your contribution';
    });
};

const showError = cForm => {
    fastdom.write(() => {
        cForm.append('Sorry there was an error submitting :*(');
    });
};

export const submitForm = (e: any) => {
    e.preventDefault();
    console.log(e);
    const cForm = e.target;
    const data = formToJSON(cForm.elements);

    return fetch('/formstack-campaign/submit', {
        method: 'post',
        body: data,
        headers: {
            Accept: 'application/json',
        },
    }).then(res => {
        if (res.ok) {
            showConfirmation(cForm);
        } else {
            showError(cForm);
        }
    });
};
