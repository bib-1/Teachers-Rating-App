const configurations ={
    'db':'mongodb+srv://bibekpoudel77:Passw0rd@cluster0.bqmsod7.mongodb.net/test',
    'github':{
        'clientId': '1c649021733165c2950b',
        'clientSecret': 'f318a73d16a2f9a2c6ecf714451a68124060a9ca',
        'callbackURL': 'https://rate-teacher.herokuapp.com/github/callback'
    },
    'google':{
        'clientId': '446714899582-0mgp2cll2b1q269qglbr3od2jn2sq974.apps.googleusercontent.com',
         'secret': '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',
         'callback': 'https://rate-teacher.herokuapp.com/google/callback'
    }
}

module.exports = configurations;