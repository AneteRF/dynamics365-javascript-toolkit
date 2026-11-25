
/**
 * Dynamics 365 - Custom Lookup Filter
 *
 * Description:
 * Filters a contact lookup to display
 * only active records.
 *
 * Event: OnLoad
 * Execution Context: Required
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.applyActiveContactFilter = function (executionContext) {

    const formContext = executionContext.getFormContext();

    const lookupControl = formContext
        .getControl("demo_contactid");

    if (!lookupControl) return;

    lookupControl.removePreSearch(
        DynamicsToolkit.filterActiveContacts
    );

    lookupControl.addPreSearch(
        DynamicsToolkit.filterActiveContacts
    );
};

DynamicsToolkit.filterActiveContacts = function (executionContext) {

    const lookupControl = executionContext.getEventSource();

    const filter = `
        <filter type="and">
            <condition
                attribute="statecode"
                operator="eq"
                value="0" />
        </filter>`;

    lookupControl.addCustomFilter(filter, "contact");
};
