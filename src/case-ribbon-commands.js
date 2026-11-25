
/**
 * Dynamics 365 Customer Service
 * Role-Based Ribbon Commands
 *
 * Description:
 * Controls case command availability based
 * on the current user's security roles.
 *
 * Entity: incident
 * Usage: Ribbon Workbench - Custom Enable Rule
 */

var DynamicsToolkit = window.DynamicsToolkit || {};

DynamicsToolkit.CaseCommands = {

    allowedRoles: [
        "Customer Service Manager",
        "System Administrator"
    ],

    /**
     * Checks whether the current user has
     * at least one authorized security role.
     */
    hasAuthorizedRole: function () {

        try {

            const userRoles = Xrm.Utility
                .getGlobalContext()
                .userSettings.roles.getAll();

            const allowedRoles =
                DynamicsToolkit.CaseCommands.allowedRoles;

            return userRoles.some(function (role) {

                return allowedRoles.some(function (allowedRole) {

                    return role.name.toLowerCase() ===
                        allowedRole.toLowerCase();

                });
            });

        } catch (error) {

            console.error(
                "Error checking security roles:",
                error.message
            );

            return false;
        }
    },

    /**
     * Determines whether the delete command
     * should be enabled.
     */
    canDeleteCase: function () {

        return DynamicsToolkit.CaseCommands
            .hasAuthorizedRole();
    }
};
