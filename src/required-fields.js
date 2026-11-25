
/**
 * Dynamics 365 - Conditional Required Fields
 *
 * Description:
 * Makes the justification field mandatory
 * when a request is rejected.
 *
 * Events: OnLoad and OnChange
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.setRequiredFields = function (executionContext) {

    const formContext = executionContext.getFormContext();

    const status = formContext
        .getAttribute("demo_approvalstatus");

    const justification = formContext
        .getAttribute("demo_justification");

    if (!status || !justification) return;

    const isRejected = status.getValue() === 100000002;

    justification.setRequiredLevel(
        isRejected ? "required" : "none"
    );
};
