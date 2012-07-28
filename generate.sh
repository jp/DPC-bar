cd "chrome/dpc"
rm ../dpc.jar
zip -r ../dpc.jar content/ locale/
cd ../..
rm dpc.xpi
zip -r dpc.xpi chrome chrome.manifest components data defaults install.rdf
