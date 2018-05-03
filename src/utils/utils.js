var stv = (window.stv != null) ? window.stv : {};
stv.utils = {
    stevia: true,
    //properties
    characters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    number: {
        sign: function (x) {
            return x ? x < 0 ? -1 : 1 : 0;
        }
    },
    //Methods
    formatNumber: function (position) {
        return position.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    formatText: function (text, spaceChar) {
        text = text.replace(new RegExp(spaceChar, "gi"), " ");
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text;
    },
    capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);;
    },
    titleCase: function (str) {
        //deprecated
        return this.capitalize(str);
    },
    camelCase: function (str) {
        return str.toLowerCase().replace(/[.-_\s](.)/g, function (match, group1) {
            return group1.toUpperCase();
        })
    },
    camelToSpace: function (str) {
        var result = str.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
        return result.charAt(0).toUpperCase() + result.slice(1);
    },
    closest: function (element, selector) {
        var matches = (element.matches) ? 'matches' : 'msMatchesSelector';
        while (element) {
            if (element[matches](selector)) {
                break;
            }
            element = element.parentElement;
        }
        return element;
    },
    isFunction: function (s) {
        return typeof (s) === 'function' || s instanceof Function;
    },
    parseDate: function (strDate) {
        return strDate.substring(4, 6) + "/" + strDate.substring(6, 8) + "/" + strDate.substring(0, 4) + " " + strDate.substring(8, 10) + ":" + strDate.substring(10, 12) + ":" + strDate.substring(12, 14);
    },
    genId: function (prefix) {
        prefix = prefix || '';
        prefix = prefix.length == 0 ? prefix : prefix + '-';
        return prefix + this.randomString(4) + this.getRandomInt(1000, 9999);
    },
    randomString: function (length) {
        length = length || 10;
        var str = "";
        for (var i = 0; i < length; i++) {
            str += this.characters.charAt(this.getRandomInt(0, this.characters.length - 1));
        }
        return str;
    },
    getRandomInt: function (min, max) {
        // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
        // Using Math.round() will give you a non-uniform distribution!
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    endsWithIgnoreCase: function (str, test) {
        return this.endsWith(str.toLowerCase(), test.toLowerCase());
    },
    endsWith: function (str, test) {
        return str.length >= test.length && str.substr(str.length - test.length) == test;
    },
    addQueryParamtersToUrl: function (paramsWS, url) {
        var chr = "?";
        if (url.indexOf("?") != -1) {
            chr = "&";
        }
        var query = stv.utils.queryString(paramsWS);
        if (query != "")
            query = chr + query;
        return url + query;
    },
    queryString: function (obj) {
        var items = [];
        for (var key in obj) {
            if (obj[key] != null && obj[key] != undefined) {
                items.push(key + '=' + encodeURIComponent(obj[key]));
            }
        }
        return items.join('&');
    },
    randomColor: function () {
        var color = "";
        for (var i = 0; i < 6; i++) {
            color += ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 16)]);
        }
        return "#" + color;
    },
    colorLuminance: function (hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        hex = String(hex).replace(/#/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#",
            c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    },
    getSpeciesFromAvailable: function (availableSpecies, speciesCode) {
        for (var phylos in availableSpecies) {
            for (var i = 0; i < availableSpecies[phylos].length; i++) {
                var species = availableSpecies[phylos][i];
                if (species.id === speciesCode || species.scientificName.toLowerCase() === speciesCode.toLowerCase()) {
                    return species;
                }
            }
        }
    },
    getSpeciesCode: function (speciesName) {
        var pair = speciesName.split(" ");
        var code;
        if (pair.length < 3) {
            code = (pair[0].charAt(0) + pair[1]).toLowerCase();
        } else {
            code = (pair[0].charAt(0) + pair[1] + pair[pair.length - 1].replace(/[/_().\-]/g, '')).toLowerCase();

        }
        return code;
    },
    basicValidationForm: function (scope) {
        var validated = true;
        var msg = "";
        if (scope.$.outdir.selectedFile === undefined || scope.$.outdir.selectedFile.type != "FOLDER") {
            msg += "Error: Please select an output folder.\n";
            validated = false;
        }
        if (scope.$.inputFile.selectedFile === undefined || scope.$.inputFile.selectedFile.type != "FILE") {
            msg += "Error: Please select an input file.\n";
            validated = false;
        }
        if (scope.$.jobName.value == "") {
            msg += "Error: Please add a job name.\n";
            validated = false;
        }
        if (!validated) {
            alert(msg)
        }
        return validated;
    },
    getUrl: function (fileId) {
        return SteviaManager.files.download({
            id: fileId,
            request: {
                url: true
            }
        });
    },
    getFileContent: function (callback, fileId) {
        SteviaManager.files.content({
            id: fileId,
            request: {
                success: function (response) {
                    callback(response);
                },
                error: function () {
                    this.message = 'Server error, try again later.';
                }
            }
        })
    },
    loadExampleFile: function (callback, toolName, exampleFileName) {

        var me = this;
        SteviaManager.files.contentExample({
            query: {
                toolName: toolName,
                fileName: exampleFileName
            },
            request: {
                //method: 'POST',
                success: function (response) {
                    callback(response);
                    //                            debugger
                    //                            me.loadedMainSelectChanged(false,true);
                },
                error: function () {
                    alert('Server error, try again later.');
                }
            }
        })
    },
    downloadExampleFile: function (toolName, fileName) {
        var url = SteviaManager.files.downloadExample({
            query: {
                toolName: toolName,
                fileName: fileName
            },
            request: {
                url: true
            }
        });
        var link = document.createElement('a');
        link.href = url;
        //link.setAttribute("download", "download.zip");
        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        link.dispatchEvent(event);
    },
    argsParser: function (form, args) {
        if (form.toolName == args.tool) {
            for (var key in args) {
                if (typeof (args[key]) == "object") {
                    if (form.$[key] !== undefined)
                        form.$[key].selectedFile = args[key];
                } else {
                    var elems = form.shadowRoot.querySelectorAll('input[name="' + key + '"]');
                    if (form.$[key] !== undefined) {
                        switch (form.$[key].type) {
                        case "checkbox":
                            form.$[key].checked = args[key];
                        default:
                            form.$[key].value = args[key];
                        }
                    }
                    for (var i = 0; i < elems.length; i++) {
                        var elem = elems[i];
                        if (elem.value == args[key])
                            elem.checked = true;
                    }

                }
            }
        }
    },
    getLinks: function (terms) {
        var links = [];
        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            links.push(stv.utils.getLink(term));
        }
        return links;
    },
    getLink: function (term) {
        var link = "http://www.ebi.ac.uk/QuickGO/GTerm?id=";
        if (term.indexOf("(") >= 0) {
            var id = term.split("(");
            if (id.length > 1)
                id = id[1];
            id = id.split(")")[0];

        } else
            id = term;
        if (id.indexOf("IPR") == 0)
            link = "http://www.ebi.ac.uk/interpro/entry/";
        link = link + id;
        return link;
    },
    myRound: function (value, decimals) {
        decimals = typeof decimals !== 'undefined' ? decimals : 2;
        value = parseFloat(value);
        /** rounding **/
        if (Math.abs(value) >= 1)
            value = value.toFixed(decimals);
        else
            value = value.toPrecision(decimals);
        value = parseFloat(value);
        return value;
    },
    formatNumber: function (value, decimals) {
        value = stv.utils.myRound(value, decimals);

        if (Math.abs(value) > 0 && Math.abs(value) < 0.001)
            value = value.toExponential();
        return value;
    },
    getSpecies: function (specieValue, species) {
        for (var i = 0; i < species.length; i++) {
            var specie = species[i];
            if (specie.value == specieValue) {
                return specie;
            }
        }
        return null;
    },
    test: function () {
        return this;
    },
    cancelFullscreen: function () {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    },
    launchFullScreen: function (element) {
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    },
    parseJobCommand: function (item) {
        var commandObject = {};
        var commandArray = item.commandLine.split(/ -{1,2}/g);
        var tableHtml = '<table cellspacing="0" style="max-width:400px;border-collapse: collapse;border:1px solid #ccc;"><tbody>';
        tableHtml += '<tr style="border-collapse: collapse;border:1px solid #ccc;font-weight:bold;">';
        tableHtml += '<td style="min-width:50px;border-collapse: collapse;border:1px solid #ccc;padding: 5px;background-color: whiteSmoke;">Parameter</td>';
        tableHtml += '<td style="border-collapse: collapse;border:1px solid #ccc;padding: 5px;background-color: whiteSmoke;">Value</td>';
        tableHtml += '</tr>';
        for (var i = 1; i < commandArray.length; i++) {
            //ignore first argument
            var paramenter = commandArray[i];
            var paramenterArray = paramenter.split(/ {1}/g);
            var name = '';
            var value = '';
            if (paramenterArray.length < 2) {
                name = paramenterArray[0];
                value = '<span color:darkgray;font-weight:bold;>This paramenter is a flag</span>';
            } else {
                name = paramenterArray[0];
                value = paramenterArray[1];
            }
            commandObject[name] = value;
            /* clean values for viz*/
            value = value.replace(/\/httpd\/bioinfo\/stevia\/analysis\/.+\/examples\//, '');
            value = value.replace('/httpd/bioinfo/stevia/accounts/', '');
            value = value.replace(/,/g, ", ");

            tableHtml += '<tr style="border-collapse: collapse;border:1px solid #ccc;">';
            tableHtml += '<td style="border-collapse: collapse;border:1px solid #ccc;padding: 5px;background-color: whiteSmoke;color:steelblue;font-weight:bold;white-space: nowrap;">' + name + '</td>';
            tableHtml += '<td style="border-collapse: collapse;border:1px solid #ccc;padding: 5px;background-color: whiteSmoke;">' + value + '</td>';
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        return {
            html: tableHtml,
            data: commandObject
        };
    },
    htmlTable: function (object) {
        var tableHtml = '';
        tableHtml += '<table cellspacing="0" style="border-collapse: collapse;border:1px solid #ccc;"><tbody>';
        for (var key in object) {
            tableHtml += '<tr style="border-collapse: collapse;border:1px solid #ccc;">';
            tableHtml += '<td style="border-collapse: collapse;border:1px solid #ccc;padding: 5px;background-color: whiteSmoke;color:steelblue;font-weight:bold;white-space: nowrap;">' + key + '</td>';
            tableHtml += '<td style="border-collapse: collapse;border:1px solid #ccc;padding: 5px;background-color: whiteSmoke;">' + object[key] + '</td>';
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table>';
        return tableHtml;
    },
    msg: function (title, msg) {
        var div = document.createElement('div');
        div.classList.add('stv-msg-hidden');
        var titleDiv = document.createElement('div');
        titleDiv.textContent = title;
        var msgDiv = document.createElement('div');
        msgDiv.textContent = msg;
        div.appendChild(titleDiv);
        div.appendChild(msgDiv);
        document.body.appendChild(div);
        div.addEventListener('click', function () {
            document.body.removeChild(div);
            div = null;
        });
        setTimeout(function () {
            div.classList.add('stv-msg-shown');
        }, 10);
        setTimeout(function () {
            if (div) {
                div.classList.remove('stv-msg-shown');
            }
        }, 4000);
        setTimeout(function () {
            if (div) {
                document.body.removeChild(div);
                div = null;
            }
        }, 5000);
    },
    repeat: function (string, count) {
        if (string == null) {
            throw new TypeError('can\'t convert ' + string + ' to object');
        }
        var str = '' + string;
        count = +count;
        if (count != count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (august 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (;;) {
            if ((count & 1) == 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            str += str;
        }
        return rpt;

    },
    clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    timeDiff: function (timeStart, timeEnd) {
        var ts = new Date(Date.parse(timeStart));
        var te = new Date(Date.parse(timeEnd));

        if (isNaN(ts) || isNaN(te)) {
            return "";
        }

        if (ts < te) {
            var milisec_diff = te - ts;
        } else {
            var milisec_diff = ts - te;
        }

        var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
        var daysMessage = days + " Days ";
        if (days === 0) {
            daysMessage = '';
        }
        var date_diff = new Date(milisec_diff);
        var hours = date_diff.getHours() - 1;
        var hoursMessage = hours + " hour";
        var minutesMessage = date_diff.getMinutes() + " minute";
        var secondsMessage = date_diff.getSeconds() + " second";
        if (hours !== 1) {
            hoursMessage += 's ';
        } else {
            hoursMessage += ' ';
        }
        if (date_diff.getMinutes() !== 1) {
            minutesMessage += 's ';
        } else {
            minutesMessage += ' ';
        }
        if (date_diff.getSeconds() !== 1) {
            secondsMessage += 's ';
        } else {
            secondsMessage += ' ';
        }
        if (hours === 0) {
            hoursMessage = '';
        }
        if (date_diff.getMinutes() === 0) {
            minutesMessage = '';
        }
        if (date_diff.getSeconds() === 0) {
            secondsMessage = '';
        }
        return daysMessage + hoursMessage + minutesMessage + secondsMessage;
    },
    deleteIndexedDB: function () {
        window.indexedDB.webkitGetDatabaseNames().onsuccess = function (sender, args) {
            var r = sender.target.result;
            for (var i in r) {
                indexedDB.deleteDatabase(r[i]);
            }
        };
    },
    subsetArray: function (array, from, to) {
        var aux = [];
        from = (from < 0) ? 0 : from;
        to = (to >= array.length) ? array.length : to;

        for (var i = from; i < to; i++) {
            aux.push(array[i]);
        }

        return aux;
    },
    applyFunctionBatch: function (array, batchsize, callback) {
        var end = batchsize;
        var auxArray = this.subsetArray(array, 0, end);

        while (auxArray.length > 0) {
            callback(auxArray);
            auxArray = this.subsetArray(array, end, end + batchsize);
            end += batchsize;
        }
    },
    humanFileSize: function (bytes) {
        var thresh = 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    },
    removeDuplicates: function (array) {
        var uniqueArray = array.filter(function (item, pos) {
            return array.indexOf(item) == pos;
        });
        return uniqueArray;
    }
};
