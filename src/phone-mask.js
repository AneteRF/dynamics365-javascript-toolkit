
/**
 * Dynamics 365 - Phone Number Formatting
 *
 * Description:
 * Formats and validates Brazilian phone numbers.
 *
 * Event: OnChange
 * Execution Context: Required
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.formatPhoneNumber = function (executionContext) {

    const formContext = executionContext.getFormContext();

    const attribute = formContext.getAttribute("telephone1");
    const control = formContext.getControl("telephone1");

    if (!attribute || !control) return;

    const notificationId = "phone_validation";

    control.clearNotification(notificationId);

    const value = attribute.getValue();

    if (!value) return;

    const digits = value.replace(/\D/g, "");

    let formatted;

    switch (digits.length) {

        case 10:
            formatted = digits.replace(
                /^(\d{2})(\d{4})(\d{4})$/,
                "($1) $2-$3"
            );
            break;

        case 11:
            formatted = digits.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                "($1) $2-$3"
            );
            break;

        default:
            control.setNotification(
                "Please enter a valid phone number with 10 or 11 digits.",
                notificationId
            );
            return;
    }

    attribute.setValue(formatted);
};
