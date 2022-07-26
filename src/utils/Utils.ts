type GenericObject = { [key: string]: any };

export function flattenKeys(object: GenericObject, initialPathPrefix = ''): GenericObject {
	if (!object || typeof object !== 'object')
		return [{ [initialPathPrefix]: object }]

	let prefix = initialPathPrefix;

	if (initialPathPrefix) {
		if (Array.isArray(object)) {
			prefix = `${initialPathPrefix}`;
		} else {
			prefix = `${initialPathPrefix}.`;
		}
	}

	return Object.keys(object)
		.flatMap((key) =>
			flattenKeys(
				object[key],
				Array.isArray(object) ? `${prefix}[${key}]` : `${prefix}${key}`,
			),
		)
		.reduce((acc, path) => ({ ...acc, ...path }))
}