interface IContact {
  name: {
    first: string
    last: string
  }
  phone: string
}

const processContact = (contact: IContact) => ({
  name: `${contact.name.first} ${contact.name.last}`,
  phone: contact.phone,
})

export const fetchUsers = async () => {
  const response = await fetch('https://randomuser.me/api/?results=50&nat=ca')
  const { results } = await response.json()
  return results.map(processContact)
}

export const login = async (username: string, password: string) => {
  const res = await fetch('http://localhost:8000/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (res.ok) {
    return true
  }

  const errMessage = await res.text()
  throw new Error(errMessage)
}
