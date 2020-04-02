

export class Welcome {
    public account = {type:'base'};
    public json = {
      account : {type:''},
      questions : [{
        name: "color",
        type: "./text",
        inputType: "color",
        title: "Favorite color："
    }, {
        
        name: "email",
        type: "./text",
        inputType: "email",
        title: "E-Mail Id：",
        placeHolder: "jon.snow@nightwatch.org",
        isRequired: true,
        validators: [{
            type: "email"
        }]
    }, {
        show: "questions[0].answer === 'red'",
        type: "./multi",
        name: "car",
        title: "Which car do you drive？",
        isRequired: true,
        colCount: 4,
        choices: [
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW"
        ],
        answer : [],
        initial: []
    }, {
        show: [
          "questions[0].answer === 'red'",
          "questions[2].answer.length",
          "questions[2].answer.indexOf('Nissan') !== -1 | noop :questions[2].answer.length"
        ].join(' && '),
        type: "./single",
        name: "city",
        title: "What is your city？",
        isRequired: true,
        colCount: 4,
        choices: [
            "Tokyo",
            "Osaka",
            "Nagoya",
            "Chennai"
        ]
    }]};

    public show(){
      this.json.account.type = 'base';
    }
}
