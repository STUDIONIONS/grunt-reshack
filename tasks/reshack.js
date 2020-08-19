module.exports = function(grunt) {
	grunt.registerMultiTask('reshack', 'ResHack updater resource', function(){
		var path = require('path'),
			fs = require('fs'),
			done = this.async(),
			options = this.options(),
			rsOptions = {},
			exec = path.resolve(__dirname, '..', 'bin', 'ResHack.exe'),
			args = [],
			saveFile,
			getLogPath = function(src){
				return path.parse(path.resolve(src)).dir + "/log/";
				//fs.mkdirSync(path_log, {recursive: true});
				//logfile = path_log + logfile;
			};
		if (process.platform !== "win32") {
			throw new Error("Запуск возможен только под Windows.");
		}
		if(!options.open){
			throw new Error("Отсутствующий аргумент 'open' (Required)");
		}
		if(!options.resource){
			throw new Error("Отсутствующий аргумент 'resource' (Required)");
		}
		try {
			fs.accessSync(exec, fs.constants.F_OK);
		}catch(e){
			throw new Error("Not Found: ResHack.exe");
		}
		let file_open = path.resolve(options.open);
		if(!grunt.file.isFile(file_open)){
			grunt.log.error("Not Found: " + file_open);
			done(false);
		}else{
			grunt.log.ok("File exists: " + file_open);
		}
		let file_resource = path.resolve(options.resource);
		if(!grunt.file.isFile(file_resource)){
			grunt.log.error("Not Found: " + file_resource);
			done(false);
		}else{
			grunt.log.ok("File exists: " + file_resource);
		}
		let logfile = "CON";
		let fff = path.parse(options.resource);
		if(options.log && typeof options.log == "boolean"){
			logfile = path.parse(options.resource).name + '.log';
			if(options.prefix_log) {
				let prefix_log = "";
				if(typeof options.prefix_log == "function") {
					prefix_log = options.prefix_log() + "--";
				}else if(typeof options.prefix_log == "string") {
					prefix_log = options.prefix_log + "--";
				}
				logfile = prefix_log + logfile;
			}
			let path_log = getLogPath(logfile);
			fs.mkdirSync(path_log, {recursive: true});
			logfile = path_log + path.parse(logfile).base;
		}

		args.push("-open");
		args.push(options.open + ",");
		saveFile = (!options.save) ? options.open : options.save;
		args.push("-save");
		args.push(saveFile + ",");
		args.push("-action");
		args.push("modify,");
		if(!options.resource) {
			throw new Error("Missing argument 'resource' (Required)");
		}
		args.push("-resource");
		args.push(options.resource + ",");
		args.push(",,");
		args.push("-log");
		args.push(logfile);
		var childProcess = require('child_process').spawn(
			exec,
			args,
			{
				stdio : "inherit",
				windowsVerbatimArguments: true
			}
		);
		childProcess.on('exit', function(code){
			grunt.log.writeln("Exit code: " + code);
			done(!code);
		});
		childProcess.on('error', function (err) {
			grunt.log.writeln("Error: " + err);
			done(false);
		});
	});
};
