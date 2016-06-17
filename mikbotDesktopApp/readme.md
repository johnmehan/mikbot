To build the Mikbot executable:

	Install node:
		brew install node

	Install electron-packager:
		npm install electron-packager -g

	electron-packager . Mikbot --platform=darwin --arch=all --overwrite

index.html contains the UI html and js