function doGet() {
  return HtmlService.createHtmlOutputFromFile('ecology');
}

const X_COORDINATE = 9;
const Y_COORDINATE = 8;
const SPECIES_NAME_COLUMN = 13;
const BATCH_SIZE = 20;
const FILE_ID = '1KRIFGhR1Vh9Y56F-TPFdXjqsQPiOfEp3'; //2023鳥類資料表.csv @ 計畫執行/都計

function getCSVfromTable(fileID){
  var file = DriveApp.getFileById(fileID);
  var csvContent = file.getBlob().getDataAsString();
  var csvData = Utilities.parseCsv(csvContent); // 將 CSV 內容轉換為二維陣列
  return csvData;
}

function getDataFromTableInBatch(startIdx, batchSize){
  var csvData = getCSVfromTable(FILE_ID);  

  var features = [];
  
  for (var i = 0; i < batchSize; i++) {
    if(csvData.length <= startIdx+i) break;
    var row = csvData[startIdx+i];

    var feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [parseFloat(row[X_COORDINATE]), parseFloat(row[Y_COORDINATE])]
      },
      "properties": {
        'species': row[SPECIES_NAME_COLUMN]
      }
    };

    features.push(feature);
  }

  return features;
}

function getTotalDataCount(){
  var csvData = getCSVfromTable(FILE_ID);
  return csvData.length;
}

function testing(){
  for(var i = 0; i < 10; i++){
    geoJSON = getJSONdataInBatch(i);
    Logger.log(geoJSON.length);
  }
}