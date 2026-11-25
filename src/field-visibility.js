
/**
 * Dynamics 365 - Dynamic Field Visibility
 *
 * Description:
 * Controls field visibility based on the
 * selected request type.
 *
 * Events: OnLoad and OnChange
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.toggleFieldVisibility = function (executionContext) {

    const formContext = executionContext.getFormContext();

    const requestType = formContext
        .getAttribute("demo_requesttype");

    const justification = formContext
        .getControl("demo_justification");

    if (!requestType || !justification) return;

    const requiresJustification =
        requestType.getValue() === 100000001;

    justification.setVisible(requiresJustification);
};
