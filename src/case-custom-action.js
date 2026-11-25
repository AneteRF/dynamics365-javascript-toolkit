
/**
 * Dynamics 365 Customer Service
 * Custom Action Execution
 *
 * Description:
 * Executes a custom Dataverse action to
 * request case escalation.
 *
 * Entity: incident
 * Action: demo_EscalateCase
 * Type: Unbound Action
 * Usage: Custom Ribbon Command
 * Parameter: PrimaryControl
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseEscalation = {

    executeEscalation: async function (caseId, reason) {

        const request = {

            CaseId: caseId,
            Reason: reason,

            getMetadata: function () {

                return {
                    boundParameter: null,
                    operationName: "demo_EscalateCase",
                    operationType: 0,
                    parameterTypes: {

                        CaseId: {
                            typeName: "Edm.String",
                            structuralProperty: 1
                        },

                        Reason: {
                            typeName: "Edm.String",
                            structuralProperty: 1
                        }
                    }
                };
            }
        };

        const response = await Xrm.WebApi.online.execute(
            request
        );

        if (!response.ok) {
            throw new Error("Case escalation failed.");
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    },

    escalateCase: async function (primaryControl) {

        const formContext = primaryControl;
        let progressVisible = false;

        try {

            const caseId = formContext.data.entity
                .getId().replace(/[{}]/g, "");

            if (!caseId) {
                throw new Error("Save the case before escalating it.");
            }

            if (formContext.data.entity.getIsDirty()) {
                throw new Error("Save pending changes first.");
            }

            const incident = await Xrm.WebApi.retrieveRecord(
                "incident",
                caseId,
                "?$select=statecode,ticketnumber"
            );

            if (incident.statecode !== 0) {
                throw new Error("Only active cases can be escalated.");
            }

            const confirmation = await Xrm.Navigation
                .openConfirmDialog({
                    title: "Escalate Case",
                    text: `Escalate case ${incident.ticketnumber} ` +
                          "to specialized support?"
                });

            if (!confirmation.confirmed) return;

            Xrm.Utility.showProgressIndicator(
                "Processing case escalation..."
            );

            progressVisible = true;

            await DynamicsToolkit.CaseEscalation
                .executeEscalation(
                    caseId,
                    "Specialized support required"
                );

            Xrm.Utility.closeProgressIndicator();
            progressVisible = false;

            await formContext.data.refresh(false);

            formContext.ui.refreshRibbon();

            await Xrm.Navigation.openAlertDialog({
                title: "Case Escalation",
                text: "Case escalation completed successfully."
            });

        } catch (error) {

            if (progressVisible) {
                Xrm.Utility.closeProgressIndicator();
                progressVisible = false;
            }

            console.error(
                "Case escalation error:",
                error.message
            );

            await Xrm.Navigation.openErrorDialog({
                message: error.message
            });

        } finally {

            if (progressVisible) {
                Xrm.Utility.closeProgressIndicator();
            }
        }
    }
};
