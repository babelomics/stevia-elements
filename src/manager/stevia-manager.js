var SteviaManager = {
    host: (typeof window.STEVIA_SERVER_HOST === 'undefined') ? 'http://localhost:5555' : window.STEVIA_SERVER_HOST,
    version: (typeof window.STEVIA_SERVER_VERSION === 'undefined') ? 'v1' : window.STEVIA_SERVER_VERSION,

    users: {
        login: function (args) {
            return SteviaManager._doRequest(args, 'users', 'login');
        },
        logout: function (args) {
            return SteviaManager._doRequest(args, 'users', 'logout');
        },
        read: function (args) {
            return SteviaManager._doRequest(args, 'users', 'info');
        },
        update: function (args) {
            return SteviaManager._doRequest(args, 'users', 'update');
        },
        updateEmail: function (args) {
            return SteviaManager._doRequest(args, 'users', 'change-email');
        },
        updatePassword: function (args) {
            return SteviaManager._doRequest(args, 'users', 'change-password');
        },
        updateNotifications: function (args) {
            return SteviaManager._doRequest(args, 'users', 'change-notifications');
        },
        resetPassword: function (args) {
            return SteviaManager._doRequest(args, 'users', 'reset-password');
        },
        create: function (args) {
            return SteviaManager._doRequest(args, 'users', 'create');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'users', 'delete');
        },
        feedback: function (args) {
            return SteviaManager._doRequest(args, 'users', 'feedback');
        },
    },

    jobs: {
        create: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'create');
        },
        run: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'run');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'delete');
        },
        download: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'download');
        },
        info: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'info');
        },
        reportError: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'report-error');
        },
        example: function (args) {
            return SteviaManager._doRequest(args, 'jobs', 'example');
        }
    },
    util: {
        proxy: function (args) {
            return SteviaManager._doRequest(args, 'util', 'proxy');
        }
    },
    tools: {
        search: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'search');
        },
        info: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'info');
        },
        help: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'help');
        },
        update: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'update');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'tools', 'delete');
        }
    },

    files: {
        list: function (args) {
            return SteviaManager._doRequest(args, 'files', 'list');
        },
        saveAttrFile: function (args) {
            return SteviaManager._doRequest(args, 'files', 'save-attr-file');
        },
        read: function (args) {
            return SteviaManager._doRequest(args, 'files', 'info');
        },
        info: function (args) {
            return SteviaManager._doRequest(args, 'files', 'info');
        },
        path: function (args) {
            return SteviaManager._doRequest(args, 'files', 'path');
        },
        delete: function (args) {
            return SteviaManager._doRequest(args, 'files', 'delete');
        },
        search: function (args) {
            return SteviaManager._doRequest(args, 'files', 'search');
        },
        filesByFolder: function (args) {
            return SteviaManager._doRequest(args, 'files', 'files');
        },
        content: function (args) {
            return SteviaManager._doRequest(args, 'files', 'content');
        },
        contentExample: function (args) {
            return SteviaManager._doRequest(args, 'files', 'content-example');
        },
        grep: function (args) {
            return SteviaManager._doRequest(args, 'files', 'grep');
        },
        createFolder: function (args) {
            return SteviaManager._doRequest(args, 'files', 'create-folder');
        },
        // setHeader: function (args) {
        //     return SteviaManager._doRequest(args, 'files', 'set-header');
        // },
        downloadExample: function (args) {
            return SteviaManager._doRequest(args, 'files', 'download-example');
        },
        addAttribute: function (args) {
            return SteviaManager._doRequest(args, 'files', 'add-attribute');
        },
        download: function (args) {
            return SteviaManager._doRequest(args, 'files', 'download');
        },
        move: function (args) {
            return SteviaManager._doRequest(args, 'files', 'move');
        },
        rename: function (args) {
            return SteviaManager._doRequest(args, 'files', 'rename');
        },
        write: function (args) {
            return SteviaManager._doRequest(args, 'files', 'write');
        },
        setBioformat: function (args) {
            return SteviaManager._doRequest(args, 'files', 'set-bioformat');
        },
        upload: function (args) {
            var url = SteviaManager._url({
                query: {
                    name: args.name,
                    parentId: args.parentId,
                    extract: args.extract,
                    deleteCompressed: args.deleteCompressed,
                    extractFolder: args.extractFolder,
                    overwriteFiles: args.overwriteFiles
                },
                request: {}
            }, 'files', 'upload');
            args.url = url;
            SteviaManager._uploadFile(args);
        }
    },
    _url: function (args, api, action) {
        var host = SteviaManager.host;
        if (typeof args.request.host !== 'undefined' && args.request.host != null) {
            host = args.request.host;
        }
        var version = SteviaManager.version;
        if (typeof args.request.version !== 'undefined' && args.request.version != null) {
            version = args.request.version;
        }
        var id = '';
        if (typeof args.id !== 'undefined' && args.id != null) {
            id = '/' + args.id;
        }

        // var url = host + '/' + version + '/' + api + id + '/' + action;
        var url = host + '/' + api + id + '/' + action;
        url = this._addQueryParamtersToUrl(args.query, url);
        return url;
    },

    _doRequest: function (args, api, action) {
        var url = SteviaManager._url(args, api, action);
        if (args.request.url === true) {
            return url;
        } else {
            var method = 'GET';
            if (typeof args.request.method !== 'undefined' && args.request.method != null) {
                method = args.request.method;
            }
            var async = true;
            if (typeof args.request.async !== 'undefined' && args.request.async != null) {
                async = args.request.async;
            }
            var request = new XMLHttpRequest();
            request.onload = function () {
                var contentType = this.getResponseHeader('Content-Type');
                if (contentType != null && contentType.indexOf('application/json') != -1) {
                    var json = JSON.parse(this.response);
                    if (json.error == null) {
                        args.request.success(json, this);
                    } else {
                        if (window.STEVIA_MANAGER_LOG === true) {
                            console.log('! ----    SteviaManager -------');
                            console.log(json.error);
                            console.log(json);
                            console.log('! ----    SteviaManager -------');
                        }
                        args.request.error(json, this);
                    }
                } else {
                    args.request.success(this.response, this);
                }
            };
            request.onerror = function (e) {
                args.request.error({
                    error: 'Request error.',
                    errorEvent: e
                }, this);
            };
            request.open(method, url, async);
            if (args.request.headers != null) {
                for (var header in args.request.headers) {
                    request.setRequestHeader(header, args.request.headers[header]);
                }
            }

            var stv_app = (window.STV_APP != undefined) ? window.STV_APP : "-";
            request.setRequestHeader("x-stv-app", stv_app);

            var stv_user = (Cookies("bioinfo_user") != undefined) ? Cookies("bioinfo_user") : "-";
            request.setRequestHeader("x-stv-user", stv_user);

            request.setRequestHeader("x-stv-api", api);
            request.setRequestHeader("x-stv-action", action);

            if (args.sid == null) {
                args.sid = Cookies("bioinfo_sid");
            }
            if (args.sid != null) {
                request.setRequestHeader("Authorization", "sid " + args.sid);
                request.withCredentials = true;
            }
            var body = null;
            if (args.request.body != null) {
                body = args.request.body;
            }
            if (args.request.responseType != null) {
                request.responseType = args.request.responseType;
            }
            request.send(body);
            return url;
        }
    },
    _uploadFile: function (args) {
        var url = args.url;
        var blob = args.file;
        var name = args.name;
        var parentId = args.parentId;
        var userId = args.userId;
        var format = args.format;
        var bioFormat = args.bioFormat;
        var callbackProgress = args.callbackProgress;
        var callbackExists = args.callbackExists;

        /**/
        var resume = true;
        var resumeInfo = {};
        var chunkMap = {};
        var chunkId = 0;
        var BYTES_PER_CHUNK = 4 * 1024 * 1024;
        // var BYTES_PER_CHUNK = 10 * 1024 * 1024;
        var SIZE = blob.size;
        var NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
        var start;
        var end;

        /**/
        var resumeResponse;
        /**/

        var getResumeInfo = function (formData, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true); //false = sync call
            xhr.setRequestHeader("Authorization", "sid " + Cookies("bioinfo_sid"));
            xhr.withCredentials = true;
            xhr.onload = function (e) {
                console.log(xhr.responseText);
                callback(JSON.parse(xhr.responseText));
            };
            xhr.send(formData);
        };
        var uploadChunk = function (formData, chunk, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader("Authorization", "sid " + Cookies("bioinfo_sid"));
            xhr.withCredentials = true;
            xhr.onload = function (e) {
                chunk.done = true;
                console.log('chunk ' + chunk.id + ' done');
                callback(JSON.parse(xhr.responseText));
            };
            xhr.send(formData);
        };
        var checkChunk = function (id, size) {
            if (typeof resumeInfo[id] === 'undefined') {
                return false;
            } else if (resumeInfo[id].size != size /*|| resumeInfo[id].hash != hash*/ ) {
                return false;
            }
            return true;
        };
        var processChunk = function (c) {
            var chunkBlob = blob.slice(c.start, c.end);

            console.log(c);
            if (checkChunk(c.id, chunkBlob.size) == false) {
                console.log('chunk ' + c.id + ' not uploaded');
                var formData = new FormData();
                formData.append('chunk_id', c.id);
                formData.append('chunk_size', chunkBlob.size);
                /*formData.append('chunk_hash', hash);*/
                formData.append("name", name);
                formData.append('userId', userId);
                formData.append('parentId', parentId);
                /*formData.append('chunk_gzip', );*/
                if (c.last) {
                    formData.append("last_chunk", true);
                    formData.append("total_size", SIZE);
                    formData.append("format", format);
                    formData.append("bioFormat", bioFormat);
                }
                formData.append('chunk_content', chunkBlob);

                uploadChunk(formData, c, function (chunkResponse) {
                    callbackProgress(c, NUM_CHUNKS, chunkResponse);
                    if (!c.last) {
                        processChunk(chunkMap[(c.id + 1)]);
                    } else {

                    }
                });
            } else {
                console.log('chunk ' + c.id + ' already uploaded');
                callbackProgress(c, NUM_CHUNKS, resumeResponse);
                if (!c.last) {
                    processChunk(chunkMap[(c.id + 1)]);
                } else {

                }
            }

        };

        /**/
        /**/

        start = 0;
        end = BYTES_PER_CHUNK;
        while (start < SIZE) {
            var last = false;
            if (chunkId == (NUM_CHUNKS - 1)) {
                last = true;
            }
            chunkMap[chunkId] = {
                id: chunkId,
                start: start,
                end: end,
                size: end - start,
                done: false,
                last: last
            };
            start = end;
            end = start + BYTES_PER_CHUNK;
            if (end > SIZE) {
                end = SIZE;
            }
            chunkId++;
        }
        if (SIZE == 0) {
            chunkMap[0] = {
                id: chunkId,
                start: 0,
                end: 0,
                size: 0,
                done: false,
                last: true
            };
        }
        if (resume) {
            var resumeFormData = new FormData();
            resumeFormData.append('resume_upload', resume);
            resumeFormData.append('chunk_map', JSON.stringify(chunkMap));
            resumeFormData.append('name', name);
            resumeFormData.append('userId', userId);
            resumeFormData.append('parentId', parentId);
            getResumeInfo(resumeFormData, function (response) {
                if (response.error == null) {
                    resumeInfo = response.resumeInfo;
                    resumeResponse = response;
                    if (response.exists) {
                        callbackExists(response.file);
                    } else {
                        setTimeout(function () {
                            processChunk(chunkMap[0]);
                        }, 50);
                    }
                } else {
                    console.log('Upload error: ' + response.error);
                }
            });
        }
    },
    _addQueryParamtersToUrl: function (paramsWS, url) {
        var chr = "?";
        if (url.indexOf("?") != -1) {
            chr = "&";
        }
        var query = this._queryString(paramsWS);
        if (query != "")
            query = chr + query;
        return url + query;
    },
    _queryString: function (obj) {
        var items = [];
        for (var key in obj) {
            if (obj[key] != null && obj[key] != undefined) {
                items.push(key + '=' + obj[key]);
            }
        }
        return items.join('&');
    },

    /*HELP METHODS*/
    getFileContent: function (fileId, cb) {
        SteviaManager.files.download({
            id: fileId,
            request: {
                async: true,
                success: function (response, req) {
                    cb(response, req);
                },
                error: function (response) {

                }
            }
        });
    },
    getFileExampleContent: function (fileName, tool, start, limit, cb) {
        SteviaManager.files.contentExample({
            query: {
                tool: tool,
                file: fileName,
                start: start,
                limit: limit
            },
            request: {
                async: true,
                success: function (response) {
                    cb(response);
                },
                error: function (response) {
                    cb(null);
                }
            }
        });

    },

    getFile: function (fileId, cb) {
        SteviaManager.files.info({
            id: fileId,
            request: {
                async: true,
                success: function (response) {
                    cb(response.response[0].results[0]);
                },
                error: function (response) {

                }
            }
        });
    },
    getJob: function (jobId, cb) {
        SteviaManager.jobs.info({
            id: jobId,
            request: {
                async: true,
                success: function (response) {
                    cb(response.response[0].results[0]);
                },
                error: function (response) {

                }
            }
        });
    },
    getFileByPath: function (path, cb) {
        SteviaManager.files.path({
            query: {
                path: path
            },
            request: {
                async: true,
                success: function (response) {
                    cb(response.response[0].results);
                },
                error: function (response) {

                }
            }
        });
    },
    renameFile: function (fileId, newname, cb) {
        SteviaManager.files.rename({
            id: fileId,
            query: {
                newname: newname
            },
            request: {
                async: true,
                success: function (response) {
                    cb(response);
                },
                error: function (response) {

                }
            }
        });
    },
    getPlainFolderFiles: function (fileId, cb) {
        SteviaManager.files.filesByFolder({
            id: fileId,
            request: {
                async: true,
                success: function (response) {
                    cb(response.response[0].results);
                },
                error: function (response) {

                }
            }
        });
    },
    updateFileAttributes: function (fileId, attributes, cb) {
        SteviaManager.files.addAttribute({
            id: fileId,
            request: {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(attributes),
                success: function (response) {
                    cb(response.response[0].results);
                },
                error: function (response) {

                }
            }
        });
    },
    updateUserNotifications: function (user, notifications, cb) {
        SteviaManager.users.updateNotifications({
            id: user,
            request: {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(notifications),
                success: function (response) {
                    cb(response.response[0].results[0]);
                },
                error: function (response) {

                }
            }
        });
    },
    getFileURL: function (fileId) {
        return SteviaManager.files.download({
            id: fileId,
            query: {
                sid: Cookies("bioinfo_sid")
            },
            request: {
                url: true
            }
        });
    },
    getExampleFileURL: function (tool, file) {
        return SteviaManager.files.downloadExample({
            query: {
                sid: Cookies("bioinfo_sid"),
                tool: tool,
                file: file
            },
            request: {
                url: true
            }
        });
    },

    //Download the file given a file Id.
    downloadFile: function (fileId, getContent) {
        var url = this.getFileURL(fileId);
        var link = document.createElement('a');
        link.href = url;
        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        link.dispatchEvent(event);
    },
    downloadFolderFiles: function (fileId, pattern, getContent) {
        var url = SteviaManager.files.download({
            id: fileId,
            query: {
                sid: Cookies("bioinfo_sid"),
                pattern: encodeURIComponent(pattern)
            },
            request: {
                url: true
            }
        });
        var link = document.createElement('a');
        link.href = url;
        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        link.dispatchEvent(event);
    },

    downloadExampleFile: function (tool, filename) {
        var url = this.getExampleFileURL(tool, filename);
        var link = document.createElement('a');
        link.href = url;
        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        link.dispatchEvent(event);
    },
};
