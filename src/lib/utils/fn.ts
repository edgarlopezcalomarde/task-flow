type GroupedData<T> = {
  [key: string]: T[];
};

export function groupBy<T>(array: T[], property: keyof T): GroupedData<T> {
  return array.reduce((result: GroupedData<T>, obj: T) => {
    const key = obj[property];

    if (key) {
      const stringKey = key.toString();
      if (result[stringKey]) {
        result[stringKey].push(obj);
      } else {
        result[stringKey] = [obj];
      }
    }

    return result;
  }, {});
}
