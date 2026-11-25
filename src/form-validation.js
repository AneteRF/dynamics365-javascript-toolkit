
/**
 * Dynamics 365 - Form Validation
 *
 * Description:
 * Validates the date range before saving a record.
 * Prevents saving when the end date is earlier
 * than the start date.
 *
 * Event: OnSave
 * Execution Context: Required
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.validateDateRange = function (executionContext) {

    const formContext = executionContext.getFormContext();
    const eventArgs = executionContext.getEventArgs();

    const notificationId = "date_range_validation";

    formContext.ui.clearFormNotification(notificationId);

    const startDate = formContext
        .getAttribute("demo_startdate")?.getValue();

    const endDate = formContext
        .getAttribute("demo_enddate")?.getValue();

    if (!startDate || !endDate) return;

    if (endDate.getTime() < startDate.getTime()) {

        eventArgs.preventDefault();

        formContext.ui.setFormNotification(
            "The end date cannot be earlier than the start date.",
            "ERROR",
            notificationId
        );
    }
};
