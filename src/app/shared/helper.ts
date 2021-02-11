export class Helper {
  static select2Options: any = {
    theme: 'bootstrap'
  };

  static runtime: any = {
    "nodejs12": {
      language: 'javascript',
      dependencies: 'json',
      codeModelDefaultValue: 'export const Helloworld = (event, context) => {\n' +
        '  return \'helloWorld nodejs\';\n' +
        '};',
      dependenciesCode: '{\r\n  \"lodash\": \"^4.1.0\"\r\n}'
    },
    "python3.7": {
      language: 'python',
      dependencies: 'text',
      codeModelDefaultValue: 'import json\r\nimport sys\r\nfrom jsonpath_rw import jsonpath, parse\r\ndef Helloworld(event, context):\r\n    body = {\r\n        \"message\": \"Python Function executed successfully!\"\r\n    }\r\n    jsonpath.auto_id_field = \'id\'\r\n    data = [match.value for match in parse(\'foo[*].id\').find({\'foo\': [{\'id\': \'bizzle\'}, {\'baz\': 3}]})]\r\n    response = {\r\n        \"statusCode\": 200,\r\n        \"body\": json.dumps(body),\r\n        \"data\": json.dumps(data)\r\n    }\r\n    return response',
      dependenciesCode: ' jsonpath_rw==1.4.0'
    },
    "go1.14": {
      language: 'go',
      dependencies: 'go',
      codeModelDefaultValue: 'package kubeless\r\n\r\nimport (\r\n\t\"github.com\/sirupsen\/logrus\"\r\n\t\"github.com\/kubeless\/kubeless\/pkg\/functions\"\r\n)\r\n\r\n\/\/ Handler returns the given data.\r\nfunc Helloworld(event functions.Event, context functions.Context) (string, error) {\r\n\tms := \"Helloworld go\"\r\n        logrus.Println(event)\r\n        return ms, nil\r\n}',
      dependenciesCode: 'module kubeless\r\n\r\ngo 1.14\r\n\r\nrequire (\r\n\tgithub.com\/kubeless\/kubeless v1.0.7\r\n\tgithub.com\/sirupsen\/logrus v1.6.0\r\n)'
    }
  }

}


