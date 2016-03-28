call rmdir /s /q Y:\sample-angular2\dist\
call gulp prod
call xcopy /s /i dist\* Y:\sample-angular2\dist
