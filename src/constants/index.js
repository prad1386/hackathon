export const constants = {
  PORTAL_NAME: "ENTERPRISE SCHEDULING PORTAL",
  //Navigation
  NAV_CAMPAIGNS: "Campaigns",
  NAV_MY_ASSETS: "My Assets",
  NAV_OPERATIONS: "Operations",
  NAV_REPORTS: "Reports",
  NAV_ADMIN: "Admin",
  NAV_MANAGE_TIMESLOTS: "Manage Timeslots",
  NAV_TECH_OPERATOR: "Technology Types & Operators Groups",
  NAV_MANAGE_EXCEPTIONS: "Manage Exceptions",
  NAV_MANAGE_SCHEDULERS: "Manage Schedulers",
  //Campaign Page
  TEXT_CAMPAIGN: "Campaign",
  TEXT_CREATE_NEW_CAMPAIGN: "Create a New Campaign",
  TEXT_CLONE_CAMPAIGN: "Clone Campaign",
  TEXT_MY_CAMPAIGN: "My Campaigns",
  TEXT_NEW_CAMPAIGN: "New Campaign",
  TEXT_MODIFY_CAMPAIGN: " Modify Campaign",
  TEXT_FILTERS: "Filters",
  TEXT_CLEAR_ALL_FILTERS: "Clear All Filters",
  TEXT_NO_RECORDS: "No records found.",
  //Form Fields
  TEXT_REQUIRED_FIELDS: "These fields are required",
  TEXT_CAMPAIGN_NAME: "Campaign Name",
  TEXT_DESCRIPTION: "Description",
  TEXT_TECHNOLOGY_TYPE: "Technology type",
  TEXT_TECHNOLOGY_TYPE_WIN: "Windows",
  TEXT_TECHNOLOGY_TYPE_LIN: "Linux",
  TEXT_START_DATE: "Start Date",
  TEXT_END_DATE: "End Date",
  TEXT_EMAIL_DISTRIBUTION: "Email Distribution",
  TEXT_EMAIL_NOTIFICATION: "Email Notification",
  TEXT_ASSETS: "Assets",
  TEXT_VALIDATE: "Validate ",
  TEXT_DEPLOYMENT_TYPE: "Deployment Type",
  TEXT_MANUAL_CAMPAIGN_Y: "Manual",
  TEXT_MANUAL_CAMPAIGN_N: "Automated",
  TEXT_NOTES: "Notes",
  TEXT_BUTTON_CANCEL: "Cancel",
  TEXT_BUTTON_SUBMIT: "Submit",
  TEXT_BUTTON_CLOSE: "Close",
  TEXT_BUTTON_MODIFY: "Modify",
  TEXT_BUTTON_GOBACK: "Go Back",
  TEXT_HELPER_ASSET_UPLOAD:
    "asset_instance_id is a mandatory/required column in CSV file. Please upload the correct CSV to validate the assets",
  TEXT_HELPER_SUBMIT_ENABLE:
    "Submit button will get enabled after successful validation of assets",
  TEXT_REQUIRED_CAMPAIGN_NAME: "Campaign name is a required field!",
  //Details Page
  TEXT_STATUS: "Status",
  TEXT_CAMPAIGN_START: "Campaign Start",
  TEXT_CAMPAIGN_END: "Campaign End",
  TEXT_ASSETS_UPLOADED: "Assets Uploaded",
  TEXT_CREATED_ON: "Created On",
  TEXT_CREATED_BY: "Created By",
  //My Assets Page
  TEXT_MY_ASSETS: "My Assets",
  TEXT_CURRENT_ASSETS: "Current Assets",
  TEXT_SCHEDULE_ASSETS: "Schedule Assets",
  TEXT_PENDING_DEPLOYMENTS: "Pending Deployments",
  TEXT_SUCCESSFUL_DEPLOYMENTS: "Successful Deployments",
  TEXT_SELECTION: "Selection",
  TEXT_SELECT_A_CAMPAIGN: "Select a Campaign",
  TEXT_SEARCH_A_CAMPAIGN: "Search a campaign",
  TEXT_CLEAR_SELECTION: "Clear Selection",
  TEXT_INFO_MESSAGE:
    "To start scheduling the asset(s), please select a campaign from the drop down",
  //My Assets DetailsPage
  TEXT_ASSET_NAME: "Asset Name",
  TEXT_ASSET_STATUS: "Asset Status",
  TEXT_PRODUCT_TIER_1: "Product Tier 1",
  TEXT_PRODUCT_TIER_2: "Product Tier 2",
  TEXT_PRODUCT_TIER_3: "Product Tier 3",
  TEXT_DIVISION: "Division",
  TEXT_TSS_MANAGER: "Tss Manager",
  TEXT_SERVER_OWNER: "Server Owner",
  TEXT_ENVIRONMENT: "Environment",
  TEXT_LOCATION: "Location",
  TEXT_PATCH_STATUS: "Patch Status",
  TEXT_CR_NUMBER: "CR Number",
  TEXT_CR_STATUS: "CR Status",
  TEXT_SCHEDULE_ID: "Schedule Id",
  TEXT_SCHEDULE_DATE: "Scheduled Date",
  TEXT_SCHEDULE_TIME: "Scheduled Time",
  TEXT_EXCEPTION_STATUS: "Exception Status",
  TEXT_VIEW_ASSET_LOG: "Activity Log",
  //Admin Technology Type & Operator Group
  TEXT_BUTTON_NEW_ENTRY: "New Entry",
  TEXT_TECH_TYPE_OPERATOR_GRP: "Technology Type & Operator Groups",
  TEXT_TAB_LABEL_TECH_TYPES: "Technology Types",
  TEXT_TAB_LABEL_OPERATOR_GRPS: "Operator Groups",
  //Operator Group
  TEXT_OPERATOR_GROUP: "Operator Group",
  TEXT_LIST_OPERATOR_GRPS: "List of Operator Groups",
  TEXT_ASSIGN_OPERATOR_GRP_DIALOG_TITLE:
    "Assign an Operator Group to a Technology Type",
  TEXT_CONFIRM: "Confirm",
  TEXT_RETIRE_MSG:
    "Do you really want to retire this operator group & technology type mapping? Please confirm.",
  TEXT_DIFFERENT_TECH_TYPE_MSG: "Please select different technology type.",
  //Technology Types
  TEXT_LIST_TECHNOLOGY_TYPES: "List of Technology Types",
  TEXT_NEW_TECH_TYPE_DIALOG_TITLE: "Add a New Technology Type",
  //Manage Timeslots
  TEXT_MANAGE_TIMESLOTS: "Manage Timeslots",
  TEXT_LIST_OF_TIMESLOTS: "List of available timeslots",
  TEXT_NEW_TIMESLOT_DIALOG_TITLE: "Create a new timeslot",
  TEXT_TIMESLOT_NAME: "Timeslot Name",
  TEXT_DAY_OF_WEEK: "Day of Week",
  TEXT_START_TIME: "Start Time",
  TEXT_END_TIME: "End Time",
  TEXT_MAXIMUM_NUMBER_OF_ASSETS: "Maximum Number of Assets",
  TEXT_MAX_ASSETS: "Max Assets",
  TEXT_ENTER_MAX_ASSETS: "Enter Max num of Assets",
  //Manage Schedulers
  TEXT_MANAGE_SCHEDULERS: "Manage Schedulers",
  TEXT_ASSIGNED_SCHEDULER_GRPS: "List of assigned scheduler groups",
  TEXT_NEW_SCHEDULER_GRP_DIALOG_TITLE: "Add a New Scheduler Group",
  TEXT_SCHEDULER_GROUP: "Scheduler Group",
  TEXT_RETIRE_SCH_MSG:
    "Do you really want to retire this scheduler group & product tier mapping? Please confirm.",
  TEXT_WARNING_MSG:
    "Please be aware that any existing Campaigns and their Schedules, that are related to the Scheduler Group, can be impacted.",
  //Operations
  TEXT_OPERATIONS: "Operations",
  TEXT_TAB_LABEL_UPCOMING_PATCHES: "Upcoming Patches",
  TEXT_TAB_LABEL_NEED_ATTENTION: "Assets Needing Attention",
  TEXT_ASSETS_FAILED_PATCH_STATUS:
    "List of assets failed during patching, pre-check or post-check",
  TEXT_OVERALL_STATUS: "Overall Status",
  TEXT_PATCHING_STATUS: "Patching Status",
  TEXT_PRECHECK_STATUS: "Pre-Check Status",
  TEXT_POSTCHECK_STATUS: "Post-Check Status",
  TEXT_OPERATOR_NAME: "Operator Name",
  TEXT_OPERATOR_NOTES: "Operator Notes",
  TEXT_JOB_SCHEDULED_TO_BEGIN: "Jobs scheduled to begin",
  TEXT_ASSIGN_TO_ME: "This Asset will get assigned to you. Please confim.",
  TEXT_EDIT: "This record can be updated",
  //Manage Exceptions
  TEXT_MANAGE_EXCEPTIONS: "Manage Exceptions",
  TEXT_ASSETS_WITH_EXCEPTONS: "List of assets with exceptions",
  TEXT_NEW_EXCEPTION_FOR_ASSET: "Create a new exception",
  TEXT_JUSTIFICATION: "Justification",
  TEXT_ADDITIONAL_INFO: "Additional Info",
  TEXT_REQ_EXCEPTION_FOR: "Request Exception for",
  TEXT_REQ_EXCEPTION: "Request Exception",
  TEXT_EXCEPTION_START: "Exception Start",
  TEXT_EXCEPTION_END: "Exception End",
  TEXT_STATUS_NOTE: "Status Note",
  TEXT_APPROVE: "Approve",
  TEXT_DENY: "Deny",
  TEXT_SINGLE_ASSET: "Single Asset",
  TEXT_ALL_ASSETS_PT3: "All Assets for Product Tier 3",
  TEXT_PENDING_APPROVAL: "Pending approval",
  TEXT_STATUS_CHANGED_BY: "Status Changed By",
  TEXT_SCHEDULED_ASSET_MSG_PT3:
    " Below asset(s) are already scheduled. Please cancel the schedule for them to raise an exception.",
  TEXT_SCHEDULED_ASSET_MSG:
    " Selected asset is already scheduled. Please cancel the schedule to raise an exception.",
  //Reporting
  TEXT_REPORTS: "Reports",
  TEXT_REPORT_NAME: "Report Name",
  TEXT_CAMPAIGN_PROGRESS_REPORT: "Campaign Progress Report",
  TEXT_CAMPAIGN_PATCH_REPORT: "Campaign Patch Failures",
  TEXT_ASSETS_PENDING_REPORT: "Assets Pending Scheduling",
  TEXT_PATCH_MANUAL_REPORT: "Patch with Manual Intervention",
  TEXT_CATEGORY: "Category",
  TEXT_LIST_OF_REPORTS: "List of available reports",
  TEXT_LIST_OF: "List of",
  TEXT_RELEASE_NOTES: "Prod Release v1.0 :",
  TEXT_REFRESH: " Data will get refresh in every 30 seconds",
};
