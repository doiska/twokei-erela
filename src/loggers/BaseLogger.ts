import winston, { createLogger } from "winston";

type AnyColor = LogColors | BGColors | TextEffects;

const create = (label = "CORE", colors: AnyColor): winston.Logger =>
	createLogger({
		level: "info",
		format: winston.format.combine(
			winston.format.label({ label }),
			winston.format.timestamp({
				format: "DD/MM/YYYY HH:mm:ss",
			}),
			winston.format.printf(
				({ label, timestamp, level, message, ...rest }) => {
					const levelColor =  level === "error" ? LogColors.FgRed : colors;
					const levelAndLabel = `[${label} - ${level}]`.toUpperCase();
					const serialized = JSON.stringify(rest, null, 2);

					return (
						`${levelColor} (${timestamp}) ${levelAndLabel} ${message} ${serialized === '{}' ? '' : serialized} ${TextEffects.Reset}`
					)
				}
			)
		),
		transports: [new winston.transports.Console()],
	});

enum LogColors {
	FgBlack = "\x1b[30m",
	FgRed = "\x1b[31m",
	FgGreen = "\x1b[32m",
	FgYellow = "\x1b[33m",
	FgBlue = "\x1b[34m",
	FgMagenta = "\x1b[35m",
	FgCyan = "\x1b[36m",
	FgWhite = "\x1b[37m",
}

enum TextEffects {
	Reset = "\x1b[0m",
	Bright = "\x1b[1m",
	Dim = "\x1b[2m",
	Underscore = "\x1b[4m",
	Blink = "\x1b[5m",
	Reverse = "\x1b[7m",
	Hidden = "\x1b[8m",
}

enum BGColors {
	BgBlack = "\x1b[40m",
	BgRed = "\x1b[41m",
	BgGreen = "\x1b[42m",
	BgYellow = "\x1b[43m",
	BgBlue = "\x1b[44m",
	BgMagenta = "\x1b[45m",
	BgCyan = "\x1b[46m",
	BgWhite = "\x1b[47m",
}

export { create, LogColors, BGColors, TextEffects };