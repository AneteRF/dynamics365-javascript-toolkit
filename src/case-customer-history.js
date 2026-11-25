
/**
 * Dynamics 365 Customer Service
 * Customer Case History
 *
 * Description:
 * Retrieves the customer's latest cases using
 * FetchXML and displays the service history.
 *
 * Entity: incident
 * Usage: Custom Ribbon Command
 * Parameter: PrimaryControl
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseHistory = {

    retrieveCustomerHistory: async function (
        customerId,
        currentCaseId
    ) {

        const fetchXml = `
            <fetch top="10">
                <entity name="incident">

                    <attribute name="incidentid" />
                    <attribute name="ticketnumber" />
                    <attribute name="title" />
                    <attribute name="createdon" />
                    <attribute name="statuscode" />

                    <order attribute="createdon"
                           descending="true" />

                    <filter type="and">
                        <condition
                            attribute="customerid"
                            operator="eq"
                            value="${customerId}" />

                        <condition
                            attribute="incidentid"
                            operator="ne"
                            value="${currentCaseId}" />
                    </filter>

                </entity>
            </fetch>`;

        const result = await Xrm.WebApi.retrieveMultipleRecords(
            "incident",
            "?fetchXml=" + fetchXml
        );

        return result.entities;
    },

    showCustomerHistory: async function (primaryControl) {

        const formContext = primaryControl;

        try {

            const customer = formContext
                .getAttribute("customerid")?.getValue();

            const caseId = formContext.data.entity
                .getId().replace(/[{}]/g, "");

            if (!customer || !customer.length) {
                throw new Error("Select a customer first.");
            }

            if (!caseId) {
                throw new Error("Save the current case first.");
            }

            const customerId = customer[0].id
                .replace(/[{}]/g, "");

            const cases = await DynamicsToolkit.CaseHistory
                .retrieveCustomerHistory(customerId, caseId);

            if (cases.length === 0) {

                await Xrm.Navigation.openAlertDialog({
                    text: "No previous cases found."
                });

                return;
            }

            const history = cases.map(item => {

                const status =
                    item["statuscode@OData.Community.Display.V1.FormattedValue"]
                    || item.statuscode;

                const date = new Date(item.createdon)
                    .toLocaleDateString();

                return [
                    item.ticketnumber,
                    item.title,
                    `Status: ${status}`,
                    `Created: ${date}`
                ].join("\n");

            }).join("\n\n");

            await Xrm.Navigation.openAlertDialog(
                {
                    title: "Customer Case History",
                    text: history,
                    confirmButtonLabel: "Close"
                },
                {
                    width: 600,
                    height: 500
                }
            );

        } catch (error) {

            console.error(
                "Customer history error:",
                error.message
            );

            await Xrm.Navigation.openErrorDialog({
                message: error.message
            });
        }
    }
};
