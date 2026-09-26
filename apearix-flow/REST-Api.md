REST API Routes - Module Wise

Module: CORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /
  • Controller: app.controller.ts
  ➤ Status: ✓

+
Module: AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /change-password
  • Controller: auth.controller.ts
  ➤ Status: ✓

Step 2. POST /forgot-password
  • Controller: auth.controller.ts
  ➤ Status: ✓

Step 3. POST /login
  • Controller: auth.controller.ts
  ➤ Status: ✓

Step 4. POST /login-as-admin
  • Controller: auth.controller.ts
  ➤ Status: ✓

Step 6. POST /logout
  • Controller: auth.controller.ts
  ➤ Status: ✓

Step 7. POST /register
  • Controller: auth.controller.ts
  ➤ Status: ✓

Step 11. POST /reset-password
  • Controller: auth.controller.ts
  ➤ Status: ✓
 
Module: CRON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /cron/wallet-balance-zero/clean
  • Controller: cron.controller.ts
  ➤ Status: ✓

Step 2. GET /cron/wallet-balance-zero/jobs
  • Controller: cron.controller.ts
  ➤ Status: ✓

Step 3. GET /cron/wallet-balance-zero/jobs/:jobId
  • Controller: cron.controller.ts
  ➤ Status: ✓

Step 4. DELETE /cron/wallet-balance-zero/jobs/:jobId
  • Controller: cron.controller.ts
  ➤ Status: ✓

Step 5. POST /cron/wallet-balance-zero/jobs/:jobId/retry
  • Controller: cron.controller.ts
  ➤ Status: ✓

Step 6. POST /cron/wallet-balance-zero/run
  • Controller: cron.controller.ts
  ➤ Status: ✓

Step 7. GET /cron/wallet-balance-zero/run
  • Controller: cron.controller.ts
  ➤ Status: ✓

Step 8. GET /cron/wallet-balance-zero/status
  • Controller: cron.controller.ts
  ➤ Status: ✓


Module: LOGGER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /logs
  • Controller: logs.controller.ts
  ➤ Status: ✓

Step 2. POST /logs
  • Controller: logs.controller.ts
  ➤ Status: ✓


Module: LOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /logs
  • Controller: logs.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/BLOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/blogs
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/blogs
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/blogs/:id
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/blogs/:id
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/blogs/:id
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/blogs/bulk-status
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 7. POST /admin/blogs/bulk-upload
  • Controller: blogs.controller.ts
  ➤ Status: ✓ 

Step 9. POST /admin/blogs/views-update/:id
  • Controller: blogs.controller.ts
  ➤ Status: ✓
 

Module: PANEL/ADMIN/CATEGORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/categories
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/categories
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/categories/:id
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/categories/:id
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/categories/:id
  • Controller: categories.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/CATEGORY-TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/category-types
  • Controller: category-types.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/category-types
  • Controller: category-types.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/category-types/:id
  • Controller: category-types.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/category-types/:id
  • Controller: category-types.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/category-types/:id
  • Controller: category-types.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/category-types/bulk-delete
  • Controller: category-types.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/CONTACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/contacts
  • Controller: contacts.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/contacts
  • Controller: contacts.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/contacts/:id
  • Controller: contacts.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/contacts/:id
  • Controller: contacts.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/contacts/:id
  • Controller: contacts.controller.ts
  ➤ Status: ✓ 

Module: PANEL/ADMIN/DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /admin/dashboard
  • Controller: dashboard.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/FAQS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/faqs
  • Controller: faqs.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/faqs
  • Controller: faqs.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/faqs/:id
  • Controller: faqs.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/faqs/:id
  • Controller: faqs.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/faqs/:id
  • Controller: faqs.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/faqs/bulk-upload
  • Controller: faqs.controller.ts
  ➤ Status: ✓
Step 6. DELETE /admin/faqs/bulk-delete
  • Controller: faqs.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/items
  • Controller: items.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/items
  • Controller: items.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/items/:id
  • Controller: items.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/items/:id
  • Controller: items.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/items/:id
  • Controller: items.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/items/bulk-upload
  • Controller: items.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/LEGAL-PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/pages
  • Controller: pages.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/pages
  • Controller: pages.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/pages/:id
  • Controller: pages.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/pages/:id
  • Controller: pages.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/pages/:id
  • Controller: pages.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/pages/bulk-status
  • Controller: pages.controller.ts
  ➤ Status: ✓
 
Module: PANEL/ADMIN/NOTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/notifications
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/notifications
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/notifications/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/notifications/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/notifications/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/notifications/:id/read
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 7. DELETE /admin/notifications/delete-all
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 8. DELETE /admin/notifications/delete/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 9. POST /admin/notifications/mark-all-read
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 10. GET /admin/notifications/unread-count
  • Controller: notifications.controller.ts
  ➤ Status: ✓
 
Module: PANEL/ADMIN/PARAGRAPH-CONTENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/paragraph-contents
  • Controller: paragraph-contents.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/paragraph-contents
  • Controller: paragraph-contents.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/paragraph-contents/:id
  • Controller: paragraph-contents.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/paragraph-contents/:id
  • Controller: paragraph-contents.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/paragraph-contents/:id
  • Controller: paragraph-contents.controller.ts
  ➤ Status: ✓

Step 6. GET /admin/paragraph-contents/export
  • Controller: paragraph-contents.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/PERMISSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/permissions
  • Controller: permissions.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/permissions
  • Controller: permissions.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/permissions/:id
  • Controller: permissions.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/permissions/:id
  • Controller: permissions.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/permissions/:id
  • Controller: permissions.controller.ts
  ➤ Status: ✓

Step 6. GET /admin/permissions/master
  • Controller: permissions.controller.ts
  ➤ Status: ✓
 
Module: PANEL/ADMIN/PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /admin/profile
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 2. PUT /admin/profile
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 3. POST /admin/profile/update-avatar
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 4. POST /admin/profile/update-password
  • Controller: profile.controller.ts
  ➤ Status: ✓
   

Module: PANEL/ADMIN/ROLE-PERMISSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/role-permissions
  • Controller: role-permissions.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/role-permissions
  • Controller: role-permissions.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/role-permissions/:id
  • Controller: role-permissions.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/ROLE-USERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/role-users
  • Controller: role-users.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/role-users
  • Controller: role-users.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/role-users/:id
  • Controller: role-users.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/ROLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/roles
  • Controller: roles.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/roles
  • Controller: roles.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/roles/:id
  • Controller: roles.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/roles/:id
  • Controller: roles.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/roles/:id
  • Controller: roles.controller.ts
  ➤ Status: ✓

Step 6. GET /admin/roles/master
  • Controller: roles.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/meta-TAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/meta-tags
  • Controller: meta-tags.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/meta-tags
  • Controller: meta-tags.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/meta-tags/:id
  • Controller: meta-tags.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/meta-tags/:id
  • Controller: meta-tags.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/meta-tags/:id
  • Controller: meta-tags.controller.ts
  ➤ Status: ✓


Module: PANEL/ADMIN/SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/settings
  • Controller: settings.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/settings
  • Controller: settings.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/settings/:id
  • Controller: settings.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/settings/:id
  • Controller: settings.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/settings/:id
  • Controller: settings.controller.ts
  ➤ Status: ✓

Step 6. DELETE /admin/settings/assets/:key
  • Controller: settings.controller.ts
  ➤ Status: ✓

Module: PANEL/ADMIN/SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/system/cache/clear
  • Controller: system.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/system/diagnosis/crons
  • Controller: system.controller.ts
  ➤ Status: ✓

Step 3. POST /admin/system/diagnosis/crons/run
  • Controller: system.controller.ts
  ➤ Status: ✓

Step 4. POST /admin/system/storage/link
  • Controller: system.controller.ts
  ➤ Status: ✓

  

Module: PANEL/ADMIN/USER-LOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/user-logs
  • Controller: user-logs.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/user-logs
  • Controller: user-logs.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/user-logs/:id
  • Controller: user-logs.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/user-logs/:id
  • Controller: user-logs.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/user-logs/:id
  • Controller: user-logs.controller.ts
  ➤ Status: ✓

 
Module: PANEL/ADMIN/USER-SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/user-settings
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/user-settings
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/user-settings/:id
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/user-settings/:id
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/user-settings/:id
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/user-settings/bulk-upload
  • Controller: user-settings.controller.ts
  ➤ Status: ✓
  
Module: PANEL/ADMIN/USERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /admin/users
  • Controller: users.controller.ts
  ➤ Status: ✓

Step 2. GET /admin/users
  • Controller: users.controller.ts
  ➤ Status: ✓

Step 3. GET /admin/users/:id
  • Controller: users.controller.ts
  ➤ Status: ✓

Step 4. PUT /admin/users/:id
  • Controller: users.controller.ts
  ➤ Status: ✓

Step 5. DELETE /admin/users/:id
  • Controller: users.controller.ts
  ➤ Status: ✓

Step 6. POST /admin/users/login-as/:id
  • Controller: users.controller.ts
  ➤ Status: ✓

Step 7. POST /admin/users/update-status/:id
  • Controller: users.controller.ts
  ➤ Status: ✓
  
Module: PANEL/COMMON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /check
  • Controller: referrals.controller.ts
  ➤ Status: ✓

Step 2. GET /common/categories
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 3. GET /common/categories/children
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 4. GET /common/categories/types
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 5. GET /common/master-setting
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 6. GET /common/model-data
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 7. GET /common/permissions
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 8. GET /common/roles
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 9. GET /common/users
  • Controller: common.controller.ts
  ➤ Status: ✓

Step 10. GET /faqs
  • Controller: faqs.controller.ts
  ➤ Status: ✓

Step 11. GET /faqs/:slug
  • Controller: faqs.controller.ts
  ➤ Status: ✓

Step 12. GET /pages
  • Controller: pages.controller.ts
  ➤ Status: ✓

Step 13. GET /pages/:slug
  • Controller: pages.controller.ts
  ➤ Status: ✓


Module: PANEL/SITE/BLOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /blogs
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 2. GET /blogs/:slug
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 3. POST /blogs/:slug/view
  • Controller: blogs.controller.ts
  ➤ Status: ✓

Step 4. GET /blogs/categories
  • Controller: blogs.controller.ts
  ➤ Status: ✓
 

Module: PANEL/USER/CATEGORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /user/categories
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 2. GET /user/categories
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 3. GET /user/categories/:id
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 4. PUT /user/categories/:id
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 5. DELETE /user/categories/:id
  • Controller: categories.controller.ts
  ➤ Status: ✓

Step 6. GET /user/categories/types
  • Controller: categories.controller.ts
  ➤ Status: ✓
 
Module: PANEL/USER/DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /user/dashboard
  • Controller: dashboard.controller.ts
  ➤ Status: ✓


Module: PANEL/USER/FIREBASE-TOKENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /user/firebase-tokens
  • Controller: firebase-tokens.controller.ts
  ➤ Status: ✓

Step 2. DELETE /user/firebase-tokens
  • Controller: firebase-tokens.controller.ts
  ➤ Status: ✓


Module: PANEL/USER/ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. GET /user/items
  • Controller: items.controller.ts
  ➤ Status: ✓
 
Module: PANEL/USER/NOTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /user/notifications
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 2. GET /user/notifications
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 3. GET /user/notifications/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 4. PUT /user/notifications/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 5. DELETE /user/notifications/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 6. GET /user/notifications/mark-all-read
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 7. GET /user/notifications/read/:id
  • Controller: notifications.controller.ts
  ➤ Status: ✓

Step 8. GET /user/notifications/unread-count
  • Controller: notifications.controller.ts
  ➤ Status: ✓

 

Module: PANEL/USER/PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
Step 4. GET /user/profile
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 5. PUT /user/profile
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 6. POST /user/profile/delegate-access/reset
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 7. GET /user/profile/notification-preference
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 8. PUT /user/profile/notification-preference
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 9. POST /user/profile/status
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 10. POST /user/profile/update-avatar
  • Controller: profile.controller.ts
  ➤ Status: ✓

Step 11. POST /user/profile/update-password
  • Controller: profile.controller.ts
  ➤ Status: ✓ 

Module: PANEL/USER/SUPPORT-TICKETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /user/support-tickets
  • Controller: support-tickets.controller.ts
  ➤ Status: ✓

Step 2. GET /user/support-tickets
  • Controller: support-tickets.controller.ts
  ➤ Status: ✓

Step 3. GET /user/support-tickets/:id
  • Controller: support-tickets.controller.ts
  ➤ Status: ✓

Step 4. PUT /user/support-tickets/:id
  • Controller: support-tickets.controller.ts
  ➤ Status: ✓

Step 5. DELETE /user/support-tickets/:id
  • Controller: support-tickets.controller.ts
  ➤ Status: ✓

Step 6. POST /user/support-tickets/status/:id
  • Controller: support-tickets.controller.ts
  ➤ Status: ✓

Module: PANEL/USER/USER-LOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /user/user-logs
  • Controller: user-logs.controller.ts
  ➤ Status: ✓

Step 2. GET /user/user-logs
  • Controller: user-logs.controller.ts
  ➤ Status: ✓

Step 3. GET /user/user-logs/:id
  • Controller: user-logs.controller.ts
  ➤ Status: ✓


Module: PANEL/USER/USER-SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1. POST /user/user-settings
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 2. GET /user/user-settings
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 3. GET /user/user-settings/:id
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 4. PUT /user/user-settings/:id
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 5. DELETE /user/user-settings/:id
  • Controller: user-settings.controller.ts
  ➤ Status: ✓

Step 6. POST /user/user-settings/bulk-upload
  • Controller: user-settings.controller.ts
  ➤ Status: ✓
