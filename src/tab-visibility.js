
/**
 * Dynamics 365 - Dynamic Tab and Section Visibility
 *
 * Description:
 * Controls tab and section visibility based on
 * customer type and credit approval.
 *
 * Events: OnLoad and OnChange
 * Execution Context: Required
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.toggleTabVisibility = function (executionContext) {

    const formContext = executionContext.getFormContext();

    const customerType = formContext
        .getAttribute("demo_customertype");

    const creditApproved = formContext
        .getAttribute("demo_creditapproved");

    const financialTab = formContext.ui.tabs
        .get("tab_financial");

    if (!customerType || !creditApproved || !financialTab) {
        return;
    }

    const creditSection = financialTab.sections
        .get("section_credit");

    const CORPORATE_CUSTOMER = 100000001;

    const isCorporate =
        customerType.getValue() === CORPORATE_CUSTOMER;

    const hasApprovedCredit =
        creditApproved.getValue() === true;

    financialTab.setVisible(isCorporate);

    if (creditSection) {
        creditSection.setVisible(
            isCorporate && hasApprovedCredit
        );
    }
};
