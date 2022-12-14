import Keycloak from "keycloak-js";
import { METAFORM_MANAGER_ROLE, SYSTEM_ADMIN_ROLE } from "consts";

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

  /**
   * Checks for metaform manager permission
   * 
   * @param keycloak keycloak
   */
  export const isMetaformManager = (keycloak?: Keycloak): boolean => {
    if (!keycloak?.token) {
      return false;
    }

    if (isSystemAdmin(keycloak)) {
      return true;
    }

    return keycloak?.hasRealmRole(METAFORM_MANAGER_ROLE);
  };

}

export default AuthUtils;