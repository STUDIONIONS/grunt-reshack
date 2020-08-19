module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		reshack: {
			hack: {
				options: {
					resource: "test/nw_exe.res",
					open: "test/nw.exe",
					log: true,
					prefix_log: function(){
						let date = new Date(),
							hour = date.getHours(),
							minute = date.getMinutes(),
							second = date.getSeconds(),
							millisec = date.getMilliseconds(),
							data = date.getDay(),
							month = date.getMonth() + 1,
							year = date.getFullYear(),
							format = function(len, str) {
								let string = String(str);
								return string.padStart(len, "0");
							};
						return format(2, data) + "-" + format(2, month) + "-" + year + "_" +
								format(2, hour) + "-" + format(2, minute)+ "-" + 
								format(2, second) + "." + format(4, millisec);
					}
				}
			}
		}
	});
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['reshack']);
};
