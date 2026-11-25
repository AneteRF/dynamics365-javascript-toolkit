
/**
 * Dynamics 365 Customer Service
 * Duplicate Case Validation
 *
 * Description:
 * Identifies active cases associated with
 * the same customer and subject.
 *
 * Entity: incident
 * Events: OnLoad and OnChange
 * Execution Context: Required
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseDuplicate = {

    retrieveDuplicates: async function (
        customerId,
        subjectId,
        currentCaseId
    ) {

        let filter =
            "_customerid_value eq " + customerId +
            " and _subjectid_value eq " + subjectId +
            " and statecode eq 0";

        // Exclude the current case when editing.
        if (currentCaseId) {
            filter += " and incidentid ne " + currentCaseId;
        }

        const query =
            "?$select=incidentid,ticketnumber,title,createdon" +
            "&$filter=" + encodeURIComponent(filter) +
            "&$orderby=createdon desc" +
            "&$top=5";

        const result = await Xrm.WebApi.retrieveMultipleRecords(
            "incident",
            query
        );

        return result.entities;
    },

    validateDuplicateCase: async function (executionContext) {

        const formContext = executionContext.getFormContext();

        const notificationId = "duplicate_case_validation";

        formContext.ui.clearFormNotification(notificationId);

        try {

            const customer = formContext
                .getAttribute("customerid")?.getValue();

            const subject = formContext
                .getAttribute("subjectid")?.getValue();

            if (!customer?.length || !subject?.length) return;

            const customerId = customer[0].id
                .replace(/[{}]/g, "");

            const subjectId = subject[0].id
                .replace(/[{}]/g, "");

            const caseId = formContext.data.entity
                .getId().replace(/[{}]/g, "");

            const duplicates = await DynamicsToolkit.CaseDuplicate
                .retrieveDuplicates(
                    customerId,
                    subjectId,
                    caseId
                );

            // Ignore outdated results if the selection changed.
            const currentCustomer = formContext
                .getAttribute("customerid")?.getValue();

            const currentSubject = formContext
                .getAttribute("subjectid")?.getValue();

            if (
                currentCustomer?.[0]?.id.replace(/[{}]/g, "") !== customerId ||
                currentSubject?.[0]?.id.replace(/[{}]/g, "") !== subjectId
            ) {
                return;
            }

            if (duplicates.length > 0) {

                const ticketNumbers = duplicates
                    .map(item => item.ticketnumber)
                    .join(", ");

                formContext.ui.setFormNotification(
                    "Potential duplicate cases found: " +
                    ticketNumbers +
                    ". Review existing cases before continuing.",
                    "WARNING",
                    notificationId
                );
            }

        } catch (error) {

            console.error(
                "Duplicate case validation error:",
                error.message
            );

            formContext.ui.setFormNotification(
                "Unable to validate duplicate cases.",
                "WARNING",
                notificationId
            );
        }
    }
};
