function createServices(services) {
    const itemContainer = document.getElementById("service-list")
    services.forEach((service, index) => {
        const serviceItem = document.createElement('li')
        serviceItem.setAttribute('class', 'service-item')
        serviceItem.setAttribute('data-id', service.id)

        let serviceNameItem = document.createElement('span')
        serviceNameItem.setAttribute('class', 'service-name')
        serviceNameItem.setAttribute('id', 'service-name')

        serviceNameItem.innerHTML = `${service.name} at ${service.ip_address}:${service.port}`

        let serviceTitleItem = document.createElement('span')
        serviceTitleItem.setAttribute('class', 'service-title')

        let deleteServiceButton = document.createElement('button')
        deleteServiceButton.setAttribute('class', 'delete-button')
        deleteServiceButton.setAttribute('id', `delete-service-button-${service.id}`)
        deleteServiceButton.setAttribute('data-id', service.id)
        deleteServiceButton.innerHTML = "x"

        deleteServiceButton.addEventListener('click', (event) => {
            const target = event.target
            const service_id = target.getAttribute('data-id')
            try{
                eel.delete_service(service_id)
                location.reload()
            } catch (error) {
                console.log(error)
            }
        })

        serviceTitleItem.appendChild(serviceNameItem)
        serviceTitleItem.appendChild(deleteServiceButton)

        let keyContainerItem = document.createElement('div')
        keyContainerItem.setAttribute('class', 'key-container collapsed')
        keyContainerItem.setAttribute('id', `key-container-${index}`)

        serviceItem.appendChild(serviceTitleItem)
        serviceItem.appendChild(keyContainerItem)

        serviceNameItem.addEventListener('click', (event)=>{
            const keyContainer = document.getElementById(`key-container-${index}`)
            const keyList = document.createElement('ul')
            keyList.setAttribute('class', 'key-list')
            keyList.setAttribute('id', 'key-list')

            if (keyContainer.classList.contains('collapsed')){
                eel.get_keys(serviceItem.getAttribute('data-id'))(function (response){
                    if (response.length===0){
                        const keyItem = document.createElement('p')
                        keyItem.setAttribute('class', 'no-data-text')
                        keyItem.innerHTML = "No keys found"
                        keyList.appendChild(keyItem)
                    } else {
                        response.forEach(key => {
                            let keyItemParent = document.createElement('span')
                            let keyItem = document.createElement('li')
                            let connectButton = document.createElement('button')
                            let deleteButton = document.createElement('button')

                            keyItemParent.setAttribute('class', 'key-item-parent')

                            keyItem.setAttribute('class', 'key-item')
                            keyItem.setAttribute('data-id', key.id)
                            keyItem.innerHTML = key.username

                            connectButton.setAttribute('class', 'connect-button')
                            connectButton.setAttribute('data-id', key.id)
                            connectButton.addEventListener('click', (event)=>sshConnect(event))
                            connectButton.innerHTML = "Connect"

                            deleteButton.setAttribute('class', 'delete-button')
                            deleteButton.setAttribute('data-id', key.id)
                            deleteButton.innerHTML = "Delete"
                            deleteButton.addEventListener('click', (event) => {
                                const target = event.target
                                const key_id = target.getAttribute('data-id')
                                try{
                                    eel.delete_key(key_id)
                                    location.reload()
                                } catch (error) {
                                    console.log(error)
                                }
                            })
                            
                            keyItemParent.appendChild(keyItem)
                            keyItemParent.appendChild(connectButton)
                            keyItemParent.appendChild(deleteButton)
                            keyList.appendChild(keyItemParent)
                        })
                    }
                })
                let addKeyButton = document.createElement('button')
                addKeyButton.setAttribute("class", "add-key-button")
                addKeyButton.setAttribute("id", `add-key-button`)
                addKeyButton.setAttribute('data-id', service.id)
                addKeyButton.innerHTML = "Add key"
                addKeyButton.addEventListener('click', (event)=>{
                    let addKeyForm = document.getElementById(`add-key-form-${service.id}`)
                    if (addKeyForm===null){

                        let addKeyForm = document.createElement('form')
                        let usernameInput = document.createElement('input')
                        let sshKeyPathInput = document.createElement('input')
                        let submitButton = document.createElement('input')
                        
                        addKeyForm.setAttribute("class", "add-form")
                        addKeyForm.setAttribute("id", `add-key-form-${service.id}`)
    
                        usernameInput.setAttribute('type', 'text')
                        usernameInput.setAttribute('name', 'username')
                        usernameInput.setAttribute("placeholder", "Username")
    
                        sshKeyPathInput.setAttribute('type', 'text')
                        sshKeyPathInput.setAttribute('name', 'ssh_key_path')
                        sshKeyPathInput.setAttribute("placeholder", "SSH Key path")
                        
                        submitButton.setAttribute('type', 'submit')
                        submitButton.setAttribute('value', 'Submit')
    
                        addKeyForm.appendChild(usernameInput)
                        addKeyForm.appendChild(sshKeyPathInput)
                        addKeyForm.appendChild(submitButton)
    
                        addKeyForm.addEventListener('submit', (event)=>{
                            const requestData = {"service":service.id}
                            const formData = new FormData(addKeyForm)
                            for (let item of formData){
                                requestData[item[0]] = item[1]
                            }
                            eel.add_key(requestData)
                        })
                        keyContainer.appendChild(addKeyForm)
                    } else {
                        addKeyForm.remove()
                    }
                })
                keyContainer.appendChild(keyList)
                keyContainer.appendChild(addKeyButton)
                keyContainer.classList.add('expanded')
                keyContainer.classList.remove('collapsed')
            } else {
                keyContainer.classList.add('collapsed')
                keyContainer.classList.remove('expanded')
                keyContainer.innerHTML = ''
            }
        })
        itemContainer.appendChild(serviceItem)
    })
}

function addService(){
    const container = document.getElementById("container")
    let addServiceForm = document.getElementById('add-service-form')

    if (addServiceForm===null){
        let addServiceForm = document.createElement('form')
        let nameInput = document.createElement('input')
        let ipAddressInput = document.createElement('input')
        let portInput = document.createElement('input')
        let submitButton = document.createElement('input')
        
        addServiceForm.setAttribute("class", "add-form")
        addServiceForm.setAttribute("id", `add-service-form`)
    
        nameInput.setAttribute('type', 'text')
        nameInput.setAttribute('name', 'service_name')
        nameInput.setAttribute("placeholder", "Name")
    
        ipAddressInput.setAttribute('type', 'text')
        ipAddressInput.setAttribute('name', 'service_ip')
        ipAddressInput.setAttribute("placeholder", "IP Address")
        
        portInput.setAttribute('type', 'text')
        portInput.setAttribute('name', 'service_port')
        portInput.setAttribute('placeholder', 'Port')
    
        submitButton.setAttribute('type', 'submit')
        submitButton.setAttribute('value', 'Submit')
    
        addServiceForm.appendChild(nameInput)
        addServiceForm.appendChild(ipAddressInput)
        addServiceForm.appendChild(portInput)
        addServiceForm.appendChild(submitButton)
    
        addServiceForm.addEventListener('submit', (event)=>{
            let requestData = {}
            const formData = new FormData(addServiceForm)
            for (let item of formData){
                requestData[item[0]] = item[1]
            }
            eel.add_service(requestData)
        })
        container.appendChild(addServiceForm)
    } else {
        addServiceForm.remove()
    }
}
function sshConnect(event){
    let target = event.target
    let key_id = target.getAttribute('data-id')
    eel.open_terminal(key_id)
}