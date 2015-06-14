export default function getPropertyValueByPath(obj, path) {
  path = path.split(/[\[\]\.]+/);
  if (path[path.length - 1] == "") {
    path.pop();
  }
  while (path.length && ( obj = obj[path.shift()]));
  return obj;
}
