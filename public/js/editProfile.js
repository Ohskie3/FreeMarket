const axios = window.axios

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

let token = localStorage.getItem('token')

// For phone number formatting
let cleave = new Cleave(document.getElementById('phoneU'), {
  phone: true,
  phoneRegionCode: 'US'
})

axios.get('api/user/auth', {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(({ data }) => {
    document.getElementById('nameU').value = data.name
    document.getElementById('activeN').classList.add('active')
    document.getElementById('emailU').value = data.email
    document.getElementById('activeE').classList.add('active')
    document.getElementById('usernameU').value = data.username
    document.getElementById('activeU').classList.add('active')
    document.getElementById('phoneU').value = data.phone
    document.getElementById('activeP').classList.add('active')

    let currentUsername = data.username

    document.getElementById('updateProfile').addEventListener('click', event => {
      axios.get('/api/usernames')
        .then(({ data: usernames }) => {

          let token = localStorage.getItem('token')
          let auth = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
          let update = {
            name: document.getElementById('nameU').value,
            email: document.getElementById('emailU').value,
            phone: document.getElementById('phoneU').value
          }

          if (!validateEmail(document.getElementById('emailU').value)) {
            document.getElementById('invalidEmail').innerHTML = 'Invalid email'
          }
          axios.get('api/user/auth', {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
            .then(({ data }) => {
              // confirms that username doesn't already exist 
              if ((!usernames.includes(document.getElementById('usernameU').value)) || (document.getElementById('usernameU').value == currentUsername)) {
                update.username = document.getElementById('usernameU').value
              } else {
                document.getElementById('invalidUser').innerHTML = 'Username already exists'
                document.getElementById('usernameU').classList.add('invalid')
              }
              // updates user if username is unique and email is valid
              if (validateEmail(update.email) && update.username) {
                axios.put('/api/user', update, auth)
                  .then(() => {
                    window.location = '/profile'
                  })
                  .catch(err => console.log(err))
              }
            })
            .catch(err => console.log(err))
        })
    })
  })
  .catch(err => console.log(err))

