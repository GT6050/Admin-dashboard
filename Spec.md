# Admin Dashboard - SPEC

**Stack:** React · React Router · Redux Toolkit · MUI · Tailwind · Node · Express · PostgreSQL · JWT

---

## 1 · What it does

An admin dashboard for managing users, roles and permissions, where the permissions actually restrict what each account can see and do - on the server, not only in the interface.

**There is no public sign-up.** Accounts are created from inside the application by someone who holds the permission to do so. A new user receives credentials and can then change their own password.

**Five roles ship with the system:** Admin, Manager, Moderator, User, and *No access* - the role a user gets when they are created without one. Admin holds every permission: creating users, deleting users, assigning roles, and creating, editing and deleting both roles and permissions.

**Roles are not hard-coded.** A role is a row in the database with a set of permissions attached, so an Admin can create a fifth role without a code change. Every access check in the API asks *"does this user's role hold permission X?"* - never *"is this user an Admin?"*

---

## 2 · Pages

| Route | Who can open it | What it shows |
|---|---|---|
| `/login` | public | email + password form |
| `/dashboard` | `dashboard.view` | cards with user counts; clicking a card opens `/users` |
| `/users` | `users.list` | the users table, paginated, searchable, with create / edit / delete |
| `/users/create` | `users.create` | the create form (replaces the table on the same screen) |
| `/users/:id` | `users.read`, or your own id | one user's full details, editable with `users.edit` |
| `/roles` | `roles.list` | all roles with their descriptions and permission sets; create, edit, delete |
| `/permissions` | `permissions.manage` | all permissions; create, edit, delete |
| `/reset-password/:token` | public | new password + confirm, reached from the emailed link |
| `/403` | any logged-in user | shown when a route is opened without the permission for it |
| `*` | any | not found |

**Landing page after login:** the first page in the sidebar the user has permission to open. A User - or anyone holding *No access* - has neither `dashboard.view` nor `users.list`, so they land on their own `/users/:id` and see nothing else.

---

## 3 · Features

### Dashboard
- Cards showing how many users exist, and how many hold each role
- Clicking a card opens `/users`, filtered to that role

### Users (`/users`)
- All users in a table
- **Pagination:** choose the page size, choose the page; done on the server, never by fetching everything and slicing in the browser
- **Search by name**
- **Create, edit and delete**
- **Create happens on the same screen:** pressing *Create user* hides the table and shows the form
- **Delete asks first** - a confirmation dialog with YES and NO
- Create form fields: first name, second name, last name, username, email, phone, image, **role** (autocomplete, listing the roles that exist), **country** (autocomplete over every country in the world)
- The role chosen on creation carries that role's permissions - the user is never given permissions directly

### User detail (`/users/:id`)
- Every field of one user, editable by anyone holding `users.edit`
- A user can always open and edit their own record, and change their own password

### Roles (`/roles`)
- Create, edit, delete a role
- All roles visible in one list
- Every role has a **description** saying what it is for and what it allows
- Each role shows the permissions attached to it, and an Admin can change that set
- Deleting a role that is still assigned to a user is refused, with a readable message
- Delete asks for confirmation the same way users do

### Permissions (`/permissions`)
- Create, edit, delete a permission
- Only reachable with `permissions.manage`
- A permission has a name, a **code** (the string the API checks, e.g. `users.delete`) and a description
- Deleting a permission that is attached to a role is refused

### Password reset

- *Forgot password?* on `/login` asks for an email address
- **The response is always the same**, whether or not the address exists - otherwise the form tells an attacker which emails are registered
- If it exists, an email goes out with a link containing a **single-use token, valid for 30 minutes**
- The link opens `/reset-password/:token`: new password, confirm, done
- Using the token consumes it. Expired or already-used tokens show a clear message and offer to send a new one
- A successful reset **revokes every active session** for that account
- Logged-in users change their password from their own profile instead, and must supply the current one

### Image upload

- The avatar is uploaded from the create and edit forms, not pasted as a URL
- **Accepted:** JPEG, PNG, WebP. **Rejected:** everything else, checked by content type *and* by the file's actual bytes, not by its extension
- **Maximum 2 MB**, enforced on the server as well as the client
- Stored outside the database; `users.image` holds the path or URL that the API returns
- The old file is deleted when the avatar is replaced
- A user with no image gets initials rendered in a coloured circle - no broken image, ever

### Login and session
- Unauthenticated access to any protected route redirects to `/login` (protected route)
- **The access token is valid for 5 minutes** and is held in memory only (Redux), so no script on the page can read it
- **The session survives a browser refresh through a refresh token** in an `httpOnly`, `Secure`, `SameSite=Strict` cookie, valid 7 days and stored **hashed** in the database - a leaked table must not hand out sessions
- On page load, and once on any 401, the client calls `/api/auth/refresh` and receives a new 5-minute access token. **The refresh token is rotated on every use**, and reuse of an old one revokes the whole chain
- Logging out revokes the refresh token on the server, not only in the browser
- When the refresh token itself expires or is revoked, the user is sent to `/login`
- After logging in, the user returns to the page they originally asked for
- **What this costs, accepted deliberately:** a silent refresh call on mount, cookie settings that differ between local and production, and CORS configured with `credentials: true`

### Validation and errors
- Every input validated, with rules that make sense for the field
- **The server validates everything the client validates.** The client's version is for speed; the server's is the one that counts
- Every failed request produces a visible, readable message - never a blank screen or a silent failure
- Field-level errors appear next to the field that caused them

### Navbar
- The user's image and name on the right
- Clicking either opens a menu containing *Log out*
- Logging out clears the session and redirects to `/login`

### Sidebar
- Lists the pages
- **Shows only the pages this user has permission to open** - and the server refuses them anyway if the URL is typed by hand

### Main container
- Renders the active page

---

## 4 · Roles and permissions

The matrix below is the default set attached to each seeded role. Because roles are data, an Admin can change any of it in the running application.

| Capability | Permission code | Admin | Manager | Moderator | User |
|---|---|:---:|:---:|:---:|:---:|
| Log in | - | ✓ | ✓ | ✓ | ✓ |
| See the dashboard | `dashboard.view` | ✓ | ✓ | ✓ | ✗ |
| List all users | `users.list` | ✓ | ✓ | ✓ | ✗ |
| See another user's details | `users.read` | ✓ | ✓ | ✓ | ✗ |
| Create a user | `users.create` | ✓ | ✗ | ✗ | ✓ |
| Edit a user | `users.edit` | ✓ | ✓ | ✓ | ✗ |
| Delete a user | `users.delete` | ✓ | ✓ | ✗ | ✗ |
| Assign or change a user's role | `users.assign_role` | ✓ | ✗ | ✗ | ✗ |
| List roles | `roles.list` | ✓ | ✗ | ✗ | ✗ |
| Create / edit / delete a role | `roles.manage` | ✓ | ✗ | ✗ | ✗ |
| Create / edit / delete a permission | `permissions.manage` | ✓ | ✗ | ✗ | ✗ |

**Always allowed, to every logged-in user, regardless of role:** viewing and editing their own record, and changing their own password.

**A User can create a user but cannot assign a role.** A user created this way receives the seeded **No access** role, which holds no permissions: they can see and edit their own record and change their own password, and nothing else, until somebody with `users.assign_role` gives them a real role.

**No access is a real role, not a null.** `users.role_id` is `NOT NULL` and always points at a row. A nullable foreign key would make "no role" a special case in every query, every guard and every screen, and one forgotten null check is a permission bug; a row with an empty permission set is ordinary data that every existing check already handles. It appears on `/roles` like any other role and cannot be deleted while anyone holds it.

**Rules the server enforces on top of the matrix:**
- Nobody can change their own role
- Nobody can delete or deactivate themselves
- The last remaining Admin cannot be deleted, nor have their role changed
- A role that is still assigned to at least one user cannot be deleted
- A permission that is still attached to at least one role cannot be deleted

---

## 5 · Data model

### `users`
| Column | Type | Rules |
|---|---|---|
| id | serial / uuid | primary key |
| email | text | unique (case-insensitive), not null, stored lowercase |
| password_hash | text | bcrypt, **never returned by any endpoint** |
| username | text | unique, not null |
| first_name | text | not null |
| second_name | text | optional |
| last_name | text | not null |
| role_id | integer | foreign key → `roles.id`, **not null**, `ON DELETE RESTRICT` - a user created without a role gets the seeded *No access* role |
| country | char(2) | **ISO 3166-1 alpha-2 code** - `BG`, `DE`, `GB`. The display name is looked up on the client |
| phone | text | optional, format validated |
| image | text | path or URL of the uploaded avatar, null when there isn't one |
| created_at | timestamptz | default now |
| updated_at | timestamptz | updated on every write |

### `roles`
| Column | Type | Rules |
|---|---|---|
| id | serial | primary key |
| name | text | unique, not null |
| description | text | what this role is for and what it allows |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `permissions`
| Column | Type | Rules |
|---|---|---|
| id | serial | primary key |
| name | text | human-readable, e.g. "Delete a user" |
| code | text | unique, not null - the string the API checks, e.g. `users.delete` |
| description | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `refresh_tokens`
| Column | Type | Rules |
|---|---|---|
| id | serial | primary key |
| user_id | integer | foreign key → `users.id`, `ON DELETE CASCADE` |
| token_hash | text | the token is **hashed** before storing - a leaked table must not hand out sessions |
| expires_at | timestamptz | 7 days from issue |
| revoked_at | timestamptz | set on logout, on rotation, and on password reset |
| created_at | timestamptz | |

### `password_reset_tokens`
| Column | Type | Rules |
|---|---|---|
| id | serial | primary key |
| user_id | integer | foreign key → `users.id`, `ON DELETE CASCADE` |
| token_hash | text | hashed, same reason |
| expires_at | timestamptz | 30 minutes from issue |
| used_at | timestamptz | set the moment it is redeemed; a used token never works twice |
| created_at | timestamptz | |

### `role_permissions`
| Column | Type | Rules |
|---|---|---|
| role_id | integer | foreign key → `roles.id`, `ON DELETE CASCADE` |
| permission_id | integer | foreign key → `permissions.id`, `ON DELETE RESTRICT` |
| | | primary key is `(role_id, permission_id)` - which makes duplicates impossible for free |

---

## 6 · Relationships

- **A user has exactly one role.** `users.role_id` is a `NOT NULL` foreign key, `ON DELETE RESTRICT` - a role still assigned to somebody cannot be deleted. A user created without a role gets *No access*.
- **A role has many permissions, and a permission belongs to many roles.** That is many-to-many, so it needs the `role_permissions` join table - a comma-separated `permissions` column on `roles` cannot be indexed, joined or constrained, and would have to be parsed by hand on every request.
- **A user has many refresh tokens over time** - one per active session, each revoked on logout, on rotation, or when the password is reset. Deleting a user deletes them (cascade), and the same holds for password-reset tokens.
- **Deleting:** removing a role deletes its rows in `role_permissions` (cascade) but is refused entirely while any user still holds it. A permission cannot be deleted while any role still holds it.

---

## 7 · API surface

Every response uses one shape, decided here and never varied:

```
success → { "data": ..., "meta": { "page": 1, "pageSize": 10, "total": 137 } }
error   → { "error": { "code": "VALIDATION_FAILED", "message": "...", "fields": { "email": "already in use" } } }
```

| Method | Path | Permission required | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | public | returns the user and a 5-minute token |
| POST | `/api/auth/logout` | logged in | revokes the refresh token server-side and clears the cookie |
| POST | `/api/auth/refresh` | refresh cookie | issues a new 5-minute access token and **rotates** the refresh token |
| POST | `/api/auth/forgot-password` | public | always the same response, whether the email exists or not; rate limited |
| POST | `/api/auth/reset-password` | public + token | consumes the token, sets the password, revokes every session |
| GET | `/api/auth/me` | logged in | current user with their role and permission codes |
| PATCH | `/api/auth/password` | logged in | changes **your own** password; requires the current one |
| GET | `/api/users` | `users.list` | `?page=&pageSize=&search=&role=&sort=` - all applied in SQL |
| POST | `/api/users` | `users.create` | `role_id` accepted only with `users.assign_role`, otherwise ignored |
| GET | `/api/users/:id` | `users.read`, or own id | |
| PATCH | `/api/users/:id` | `users.edit`, or own id | field whitelist differs for own record |
| DELETE | `/api/users/:id` | `users.delete` | refused for yourself and for the last Admin |
| PATCH | `/api/users/:id/role` | `users.assign_role` | sets the single role |
| GET | `/api/roles` | `roles.list` | each role with its permissions |
| POST | `/api/roles` | `roles.manage` | |
| PATCH | `/api/roles/:id` | `roles.manage` | name, description |
| PUT | `/api/roles/:id/permissions` | `roles.manage` | replaces the role's whole permission set |
| DELETE | `/api/roles/:id` | `roles.manage` | refused while any user holds it |
| GET | `/api/permissions` | `permissions.manage` | |
| POST | `/api/permissions` | `permissions.manage` | |
| PATCH | `/api/permissions/:id` | `permissions.manage` | |
| DELETE | `/api/permissions/:id` | `permissions.manage` | refused while any role holds it |
| GET | `/api/stats/overview` | `dashboard.view` | the counts behind the dashboard cards, computed in SQL |
| POST | `/api/users/:id/image` | `users.edit`, or own id | multipart upload; validates type and size, replaces and deletes the old file |
| DELETE | `/api/users/:id/image` | `users.edit`, or own id | removes the avatar and falls back to initials |
| GET | `/api/health` | public | database connectivity |

**The country list is static data on the client.** It doesn't change and it doesn't belong in the database.