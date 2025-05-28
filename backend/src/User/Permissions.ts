export enum Permissions {
    // User Profile Permissions
    SELF_READ = 'SELF_READ',
    SELF_UPDATE = 'SELF_UPDATE',
    READ_OTHER = 'READ_OTHER',
    UPDATE_OTHER = 'UPDATE_OTHER',
    DELETE_SELF = 'DELETE_SELF',
    DELETE_OTHER = 'DELETE_OTHER',

    // Content Permissions
    CREATE_POST = 'CREATE_POST',
    READ_POST = 'READ_POST',
    UPDATE_POST = 'UPDATE_POST',
    DELETE_POST = 'DELETE_POST',
    CREATE_COMMENT = 'CREATE_COMMENT',
    DELETE_COMMENT = 'DELETE_COMMENT',
    LIKE_POST = 'LIKE_POST',
    LIKE_COMMENT = 'LIKE_COMMENT',
    REPORT_POST = 'REPORT_POST',
    REPORT_COMMENT = 'REPORT_COMMENT',

    // Moderation Permissions
    IS_MUTED = 'IS_MUTED',
    IS_BANNED = 'IS_BANNED',
    MODERATE = 'MODERATE',
    DELETE_OTHER_POST = 'DELETE_OTHER_POST',
    DELETE_OTHER_COMMENT = 'DELETE_OTHER_COMMENT',

    // Administrative Permissions
    ADMIN = 'ADMIN',
    VIEW_REPORTS = 'VIEW_REPORTS',
    MANAGE_ROLES = 'MANAGE_ROLES',
    MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',

    // Messaging Permissions
    SEND_MESSAGE = 'SEND_MESSAGE',
    READ_MESSAGE = 'READ_MESSAGE',
    DELETE_MESSAGE = 'DELETE_MESSAGE',
    MODERATE_MESSAGES = 'MODERATE_MESSAGES',
}

export const defaultPermissions: string[] = [
    Permissions.SELF_READ,
    Permissions.SELF_UPDATE,
    Permissions.READ_OTHER,
    Permissions.CREATE_POST,
    Permissions.CREATE_COMMENT,
    Permissions.LIKE_POST,
    Permissions.LIKE_COMMENT,
    Permissions.DELETE_SELF,
    Permissions.DELETE_POST,
    Permissions.READ_OTHER,
    Permissions.READ_POST
];
