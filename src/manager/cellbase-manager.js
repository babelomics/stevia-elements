/*
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of JS Common Libs.
 *
 * JS Common Libs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JS Common Libs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JS Common Libs. If not, see <http://www.gnu.org/licenses/>.
 */

var CellBaseManager = {
    host: (typeof window.CELLBASE_HOST === 'undefined') ? 'http://bioinfo.hpc.cam.ac.uk/cellbase' : window.CELLBASE_HOST,
    version: (typeof window.CELLBASE_VERSION === 'undefined') ? 'v3' : window.CELLBASE_VERSION,
    get: function (args) {
        var success = args.success;
        var error = args.error;
        var async = (args.async == false) ? false: true;

        var d;
        if (args.category == 'feature' &&  args.subCategory =='variation' && args.resource =='search')
            success(CellBaseManager.searchSNPId(args));

        // remove XMLHttpRequest keys
        var ignoreKeys = ['success', 'error', 'async','paramsWS'];
        var urlConfig = {};
        for (var prop in args) {
            if (hasOwnProperty.call(args, prop) && args[prop] != null && ignoreKeys.indexOf(prop) == -1) {
                urlConfig[prop] = args[prop];
            }
        }

        var url = CellBaseManager.url(urlConfig);
        if (typeof url === 'undefined') {
            return;
        }

        if (window.CELLBASE_LOG != null && CELLBASE_LOG === true) {
            console.log(url);
        }

        var request = new XMLHttpRequest();
        request.onload = function () {
            var contentType = this.getResponseHeader('Content-Type');
            if (contentType.indexOf('application/json')!= -1) {
                var parsedResponse = JSON.parse(this.response);

                // Search transcript and get from WS
                if (!!args.paramsWS && !!args.paramsWS.transcripts && args.paramsWS.transcripts)
                    CellBaseManager.getTranscripts(args, parsedResponse);

                // Search rs and get from WS
                // TODO: Remove to search RS
                if (false)
                    CellBaseManager.getRS(args, parsedResponse);

                if (typeof success === "function") success(parsedResponse);
                d = parsedResponse;
            } else {
                console.log('Cellbase returned a non json object or list, please check the url.');
                console.log(url);
                console.log(this.response)
            }
        };
        request.onerror = function () {
            console.log("CellBaseManager: Ajax call returned " + this.statusText);
            if (typeof error === "function") error(this);
        };
        request.open("GET", url, async);
        try {
            request.send();
        } catch (e) {
            console.log("CellBaseManager: Ajax call returned " + this.statusText);
            if (typeof error === "function") error(this);
        }

        return d;

    },
    url: function (args) {
        if (args == null) {
            args = {};
        }
        if (args.params == null) {
            args.params = {};
        }

        var version = this.version;
        if (args.version != null) {
            version = args.version
        }

        var host = this.host;
        if (args.host != null) {
            host = args.host;
        }

        delete args.host;
        delete args.version;

        var config = {
            host: host,
            version: version
        };

        for (var prop in args) {
            if (hasOwnProperty.call(args, prop) && args[prop] != null) {
                config[prop] = args[prop];
            }
        }

        var query = '';
        if (config.query != null) {
            query = '/' + config.query.toString();
        }

        //species can be the species code(String) or an object with text attribute
        if (config.species && config.species.id != null) {
            if (config.species.assembly != null) {
                config.params["assembly"] = config.species.assembly.name;
            }
            // TODO Remove temporary fix
            if (config.subCategory === 'chromosome') {
                delete config.params["assembly"]
            }
            config.species = stv.utils.getSpeciesCode(config.species.scientificName);
        }

        var url;
        if (config.category === 'meta') {
            url = config.host + '/webservices/rest/' + config.version + '/' + config.category + '/' + config.subCategory;
        } else {
            url = config.host + '/webservices/rest/' + config.version + '/' + config.species + '/' + config.category + '/' + config.subCategory + query + '/' + config.resource;
        }

        url = stv.utils.addQueryParamtersToUrl(config.params, url);
        return url;
    },

    getTranscripts: function(args, parsedResponse){
        if (args.category == 'genomic' && args.subCategory === 'variant' && args.resource == 'annotation'){
            var listPositions = !!args && !!args.query ? args.query.split(',') : [];
            if (parsedResponse.response.length > 0 && listPositions.length > 0){
                var listTranscripts = [];
                // Annotate HGVS (Transcript)
                WSManager.get({
                    host: WS_HOST,
                    version: WS_VERSION,
                    // species: 'hsapiens',
                    //query: "ids=" + ensemblGeneIds.join("&ids=") ,//+ '&page=0&pageSize=10',
                    category:  'variants',
                    subCategory:  'hgvs',
                    body: JSON.stringify(listPositions),
                    async: false,
                    method: "POST",
                    headers: {
                        accept: "*/*",
                        'Content-Type': "application/json"
                    },
                    success: function (response) {
                        if (response != null)
                            listTranscripts = response;
                    },
                    error: function(response){
                        listTranscripts = [];
                        console.log(response);
    }
                });

                for (var i = 0; i < parsedResponse.response.length; i++){
                    var pIndex = i;
                    if (pIndex > -1 && listTranscripts.length > pIndex) {
                        for (var numResult = 0; numResult < parsedResponse.response[i].result.length; numResult++) {
                            parsedResponse.response[i].result[numResult].transcripts = listTranscripts[pIndex];
                        }
                    }
                }
            }
        }
    },

    searchSNPId: function(args){
        var result;
         WSManager.get({
            species: 'hsapiens',
            category: 'variation',
            subCategory: 'rs',
            async: false,
            method: 'POST',
            body: JSON.stringify(args.params.id),
            headers: {
                accept: "*/*",
                'Content-Type': "application/json"
            },
            success: function (respone) {
                result ={
                    response: [
                        {
                            "numResults": respone.length(),
                            "numTotalResults": respone.length(),
                            "result": respone
                        }
                    ]
                };
            },
            error: function (response) {
                // TODO: GRG Remove test data
                result = {
                    response: [
                        {
                            "numResults": 1,
                            "numTotalResults": 1,
                            "result":        []
                        }
                    ]
                };
		console.log(response);
            }
        });
         return result;
    },

    getRS: function(args, parsedResponse){
        if ((args.subCategory === 'variant' && args.resource == 'annotation' ) ||
            (args.subCategory === 'variation' && args.resource == 'info' ) ||
            (args.subCategory === 'region' && args.resource == 'snp' )
            ){
            console.log('getRS',args);
            var listPositions = !!args && !!args.query ? args.query.split(',') : [];
            if (parsedResponse.response.length > 0 && listPositions.length > 0){
                var listRS = [];
                // Annotate RS (RS)
                WSManager.get({
                    host: WS_HOST,
                    version: WS_VERSION,
                    category:  'variants',
                    subCategory:  'rs',
                    body: JSON.stringify(listPositions),
                    async: false,
                    method: "POST",
                    headers: {
                        accept: "*/*",
                        'Content-Type': "application/json"
                    },
                    success: function (response) {
                        if (response != null)
                            listRS = response;
                    },
                    error:function (response) {
                        console.log(response);
                    }
                });

                for (var i = 0; i < parsedResponse.response.length; i++){
                    pIndex = i;
                    if (pIndex > -1 && listRS.length > pIndex) {

                        for (var numResult = 0; numResult < parsedResponse.response[i].result.length; numResult++) {
                            parsedResponse.response[i].result[numResult].id = listRS[pIndex].id;
                            if (parsedResponse.response[i].result[numResult].annotation != undefined) {
                                parsedResponse.response[i].result[numResult].annotation.id = listRS[pIndex].id;
                            }
                        }
                    }
                }

            }
        }
    }

};
