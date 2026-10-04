# Version saves from the first implementation

Autosave data will use an explicit save key, include `version: 1`, and reset gracefully when stored data is corrupt or incompatible. Browser localStorage can persist stale development state, so save versioning must exist before progression bugs are hidden by old data.

**Consequences**

Save-load tests should cover normal restore, corrupt data reset, and incompatible version reset.
