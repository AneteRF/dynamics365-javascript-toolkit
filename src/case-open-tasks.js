
/**
 * Dynamics 365 Customer Service
 * Open Case Tasks
 *
 * Description:
 * Retrieves open tasks associated with a case
 * and displays a warning notification.
 *
 * Entity: incident
 * Related Entity: task
 * Event: OnLoad
 * Execution Context: Required
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseTasks = {

    retrieveOpenTasks: async function (caseId) {

        const id = caseId.replace(/[{}]/g, "");

        const query =
            "?$select=activityid,subject,scheduledend,statuscode" +
            "&$filter=_regardingobjectid_value eq " + id +
            " and statecode eq 0" +
            "&$orderby=scheduledend asc";

        let result = await Xrm.WebApi.retrieveMultipleRecords(
            "task",
            query,
            500
        );

        const tasks = [...result.entities];

        // Retrieve additional pages when available.
        while (result.nextLink) {

            const nextQuery = result.nextLink.substring(
                result.nextLink.indexOf("?")
            );

            result = await Xrm.WebApi.retrieveMultipleRecords(
                "task",
                nextQuery,
                500
            );

            tasks.push(...result.entities);
        }

        return tasks;
    },

    notifyOpenTasks: async function (executionContext) {

        const formContext = executionContext.getFormContext();

        const notificationId = "case_open_tasks";

        formContext.ui.clearFormNotification(notificationId);

        const caseId = formContext.data.entity.getId();

        if (!caseId) return;

        try {

            const tasks = await DynamicsToolkit.CaseTasks
                .retrieveOpenTasks(caseId);

            if (tasks.length > 0) {

                formContext.ui.setFormNotification(
                    `This case has ${tasks.length} open task(s). ` +
                    "Review pending activities before resolving it.",
                    "WARNING",
                    notificationId
                );
            }

        } catch (error) {

            console.error(
                "Error retrieving open tasks:",
                error.message
            );

            formContext.ui.setFormNotification(
                "Unable to verify pending case tasks.",
                "WARNING",
                notificationId
            );
        }
    }
};
