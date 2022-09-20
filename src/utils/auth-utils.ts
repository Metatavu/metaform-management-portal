import Keycloak from "keycloak-js";
import { SYSTEM_ADMIN_ROLE } from "types";

/**
 * Utility class for auth
 */
namespace AuthUtils {

  /**
   * Checks for admin permission
   *
   * @param keycloak keycloak
  */
  export const isSystemAdmin = (keycloak?: Keycloak): boolean => {
    if (!keycloak?.token) {
      return false;
    }

    return keycloak?.hasRealmRole(SYSTEM_ADMIN_ROLE);
  };

}

export default AuthUtils;