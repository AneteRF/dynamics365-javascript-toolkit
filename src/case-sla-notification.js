
/**
 * Dynamics 365 Customer Service
 * Case SLA Monitoring
 *
 * Description:
 * Monitors SLA KPI instances associated with
 * a case and displays warning notifications.
 *
 * Entities: incident, slakpiinstance
 * Event: OnLoad
 * Execution Context: Required
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseSLA = {

    Status: Object.freeze({
        IN_PROGRESS: 0,
        NONCOMPLIANT: 1,
        NEARING_NONCOMPLIANCE: 2,
        PAUSED: 3,
        SUCCEEDED: 4,
        CANCELED: 5
    }),

    monitorSLA: async function (executionContext) {

        const formContext = executionContext.getFormContext();

        const notificationId = "case_sla_monitoring";

        formContext.ui.clearFormNotification(notificationId);

        const caseId = formContext.data.entity
            .getId().replace(/[{}]/g, "");

        if (!caseId) return;

        try {

            const query =
                "?$select=name,status,failuretime,warningtime" +
                "&$filter=_regarding_value eq " + caseId;

            let result = await Xrm.WebApi.retrieveMultipleRecords(
                "slakpiinstance",
                query,
                500
            );

            const indicators = [...result.entities];

            // Retrieve additional pages.
            while (result.nextLink) {

                const nextQuery = result.nextLink.substring(
                    result.nextLink.indexOf("?")
                );

                result = await Xrm.WebApi.retrieveMultipleRecords(
                    "slakpiinstance",
                    nextQuery,
                    500
                );

                indicators.push(...result.entities);
            }

            const status = DynamicsToolkit.CaseSLA.Status;

            const breached = indicators.filter(
                item => item.status === status.NONCOMPLIANT
            );

            const warning = indicators.filter(
                item => item.status === status.NEARING_NONCOMPLIANCE
            );

            if (breached.length > 0) {

                formContext.ui.setFormNotification(
                    `${breached.length} SLA KPI(s) have been breached.`,
                    "ERROR",
                    notificationId
                );

            } else if (warning.length > 0) {

                formContext.ui.setFormNotification(
                    `${warning.length} SLA KPI(s) are approaching the deadline.`,
                    "WARNING",
                    notificationId
                );
            }

        } catch (error) {

            console.error("SLA monitoring error:", error.message);

            formContext.ui.setFormNotification(
                "Unable to retrieve SLA information.",
                "WARNING",
                notificationId
            );
        }
    }
};
