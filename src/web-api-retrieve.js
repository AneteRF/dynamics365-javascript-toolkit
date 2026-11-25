
/**
 * Dynamics 365 - Dataverse Web API
 *
 * Description:
 * Retrieves account information using the
 * Dataverse Web API and asynchronous programming.
 *
 * Features:
 * - Async/Await
 * - Error handling
 * - GUID validation
 * - OData query optimization
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.retrieveAccount = async function (accountId) {

    try {

        if (typeof accountId !== "string") {
            throw new Error("Account ID is required.");
        }

        const id = accountId.replace(/[{}]/g, "");

        const guidPattern =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!guidPattern.test(id)) {
            throw new Error("Invalid account ID.");
        }

        const query =
            "?$select=accountid,name,telephone1,emailaddress1";

        const account = await Xrm.WebApi.retrieveRecord(
            "account",
            id,
            query
        );

        return {
            id: account.accountid,
            name: account.name,
            phone: account.telephone1,
            email: account.emailaddress1
        };

    } catch (error) {

        console.error(
            "Error retrieving account:",
            error.message
        );

        throw error;
    }
};
