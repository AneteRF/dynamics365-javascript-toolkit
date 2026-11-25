
/**
 * Dynamics 365 Customer Service
 * Case Resolution
 *
 * Description:
 * Resolves an active case using the native
 * CloseIncident action through the Dataverse Web API.
 *
 * Entity: incident
 * Usage: Custom Ribbon Command
 * Parameter: PrimaryControl
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseResolution = {

    resolveCase: async function (primaryControl) {

        const formContext = primaryControl;

        try {

            const caseId = formContext.data.entity
                .getId().replace(/[{}]/g, "");

            if (!caseId) {
                throw new Error("Save the case before resolving it.");
            }

            if (formContext.data.entity.getIsDirty()) {
                throw new Error("Save pending changes before resolving the case.");
            }

            const incident = await Xrm.WebApi.retrieveRecord(
                "incident",
                caseId,
                "?$select=statecode"
            );

            if (incident.statecode !== 0) {
                throw new Error("Only active cases can be resolved.");
            }

            const confirmation = await Xrm.Navigation.openConfirmDialog({
                title: "Resolve Case",
                text: "Are you sure you want to resolve this case?"
            });

            if (!confirmation.confirmed) return;

            const request = {

                IncidentResolution: {
                    subject: "Case resolved",
                    description: "Customer request completed.",
                    "incidentid@odata.bind":
                        "/incidents(" + caseId + ")"
                },

                Status: 5,

                getMetadata: function () {
                    return {
                        boundParameter: null,
                        operationName: "CloseIncident",
                        operationType: 0,
                        parameterTypes: {
                            IncidentResolution: {
                                typeName: "mscrm.incidentresolution",
                                structuralProperty: 5
                            },
                            Status: {
                                typeName: "Edm.Int32",
                                structuralProperty: 1
                            }
                        }
                    };
                }
            };

            const response = await Xrm.WebApi.online.execute(request);

            if (!response.ok) {
                throw new Error("Unable to resolve the case.");
            }

            await formContext.data.refresh(false);

            formContext.ui.refreshRibbon();

            await Xrm.Navigation.openAlertDialog({
                text: "Case resolved successfully."
            });

        } catch (error) {

            console.error("Case resolution error:", error);

            await Xrm.Navigation.openErrorDialog({
                message: error.message
            });
        }
    }
};
