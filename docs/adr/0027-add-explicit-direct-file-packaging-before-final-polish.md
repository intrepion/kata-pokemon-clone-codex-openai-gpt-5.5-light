# Add explicit direct-file packaging before final polish

The final polish slice will include an explicit direct-file build target for the root `index.html` rather than assuming the Vite source entrypoint works over `file://`. Vite module development and double-click play have different constraints, so direct-file support must be packaged and tested deliberately.

**Consequences**

The direct-file regression should open the actual root file path and exercise a real user-facing launch path, not only a localhost preview.
