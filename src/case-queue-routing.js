
/**
 * Dynamics 365 Customer Service
 * Case Queue Routing
 *
 * Description:
 * Routes active cases to a destination queue
 * using the native AddToQueue action.
 *
 * Entities: incident, queue, queueitem
 * Usage: Custom Ribbon Command
 * Parameter: PrimaryControl
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseRouting = {

    routeToQueue: async function (primaryControl) {

        const formContext = primaryControl;

        try {

            const caseId = formContext.data.entity
                .getId().replace(/[{}]/g, "");

            if (!caseId) {
                throw new Error("Save the case before routing it.");
            }

            const incident = await Xrm.WebApi.retrieveRecord(
                "incident",
                caseId,
                "?$select=statecode"
            );

            if (incident.statecode !== 0) {
                throw new Error("Only active cases can be routed.");
            }

            // Select the destination queue.
            const queues = await Xrm.Utility.lookupObjects({
                allowMultiSelect: false,
                defaultEntityType: "queue",
                entityTypes: ["queue"],
                filters: [{
                    entityLogicalName: "queue",
                    filterXml: `
                        <filter>
                            <condition
                                attribute="statecode"
                                operator="eq"
                                value="0" />
                        </filter>`
                }]
            });

            if (!queues || queues.length === 0) return;

            const queueId = queues[0].id.replace(/[{}]/g, "");
            const queueName = queues[0].name;

            const confirmation = await Xrm.Navigation
                .openConfirmDialog({
                    title: "Route Case",
                    text: `Route this case to ${queueName}?`
                });

            if (!confirmation.confirmed) return;

            const request = {

                entity: {
                    entityType: "queue",
                    id: queueId
                },

                Target: {
                    "@odata.type": "Microsoft.Dynamics.CRM.incident",
                    incidentid: caseId
                },

                getMetadata: function () {
                    return {
                        boundParameter: "entity",
                        operationName: "AddToQueue",
                        operationType: 0,
                        parameterTypes: {
                            entity: {
                                typeName: "mscrm.queue",
                                structuralProperty: 5
                            },
                            Target: {
                                typeName: "mscrm.crmbaseentity",
                                structuralProperty: 5
                            }
                        }
                    };
                }
            };

            const response = await Xrm.WebApi.online.execute(
                request
            );

            if (!response.ok) {
                throw new Error("Unable to route the case.");
            }

            formContext.ui.setFormNotification(
                `Case routed to ${queueName} successfully.`,
                "INFO",
                "case_routing"
            );

            formContext.ui.refreshRibbon();

        } catch (error) {

            console.error("Case routing error:", error);

            await Xrm.Navigation.openErrorDialog({
                message: error.message
            });
        }
    }
};
