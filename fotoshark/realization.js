class User
{
    constructor(user)
    {
       this.name = user.name;
       this.password = user.password;
    }
}
class Users
{
    setOfUsers = new Set();
    constructor(users)
    {
            users.forEach(function (item)
            {
               this.setOfUsers.add(item);
            });
    }

}
class ControllerFotoshark
{
    constructor()
    {
        this.view = new ViewPage();
        this.collection = new PostCollection(ControllerFotoshark.parse(JSON.parse(localStorage.getItem('photoPosts'))));
        let v = this.view;
        if(JSON.parse(localStorage.getItem('currentCollection'))!=null)
        {
            this.currentCollection = new PostCollection(ControllerFotoshark.parse(JSON.parse(localStorage.getItem('currentCollection'))));
        }
        else
        {
            this.currentCollection = new PostCollection(ControllerFotoshark.parse(JSON.parse(localStorage.getItem('photoPosts'))));
        }
        let ind = 0;
        this.currentCollection._photoPosts.forEach(function (item, i, p) {
            v.addPhotopost(item,ind);
            ind++;
        });
        this.makeControllerToEdit();
        this.makeControllerDelete();
        this.makeControllerLikes();
        if(JSON.parse(localStorage.getItem('username'))!=null)
        {
            let user = {};
            user.name = JSON.parse(localStorage.getItem('username')).toString();
            user.picture = "Dpunk.jpg";
            v.authorization(user);
            this.makeControllerLikes();
        }
    }
   static parse(photoPosts)
    {
        photoPosts.forEach(function (item) {
            item.createdAt = new Date(item.createdAt);
        });
        return photoPosts;
    }
    makeControllers()
    {
        this.makeSearchController();
        this.makeControllerToAuth();
        this.makeControllerToAdd();
        this.makeControllerAdd();
        this.makeControllerInput();
        this.makeControllerErrorL();
        this.makeControllerErrorA();
    }
    makeControllerLogin()
    {
        let c = this;
        let cView = this.view;
        let elementLog = document.getElementById("Login");
        let elementMain = document.getElementById("Main");
        let elementPlace = document.getElementById('placeSearch');
        let collection = this.collection;
        let currentCollection = this.currentCollection;
        let handle = function()
        {
            let user = {};
            user.name = document.getElementById('name').value;
                cView.removeAll(currentCollection.getLength());
                currentCollection.removeAll();
                currentCollection.addAll(collection);
                cView.addAll(currentCollection);
                c.makeControllerToEdit();
                c.makeControllerDelete();
                user.picture = 'Dpunk.jpg';// пока так, потом будет браться с сервера
                cView.authorization(user);
                c.makeControllerLikes();
                ViewPage.save(user.name);
                elementLog.style.display = "none";
                elementMain.style.display = "block";
                elementPlace.value="";
        };
        let login = document.getElementById('log');
        login.addEventListener('click', handle);
    }
    makeControllerToAuth()
    {
        let c = this;
        let elementLog = document.getElementById("Login");
        let elementMain = document.getElementById("Main");
        let handle = function()
        {
            elementLog.style.display="block";
            elementMain.style.display="none";
            c.makeControllerLogin();
        };
        let login = document.getElementById('lg');
        login.addEventListener('click', handle);
    }
    makeSearchController() {
        let elementPlace = document.getElementById('placeSearch');
        let cView = this.view;
        let cCollection = this.collection;
        let CurrCollection = this.currentCollection;
        let c = this;
        let handle = function () {
            if (elementPlace.innerText != undefined) {
                let value = elementPlace.value;
                if (value != undefined) {
                    cView.removeAll(CurrCollection.getLength());
                    if(value==='')
                    {
                        CurrCollection.removeAll();
                        CurrCollection.addAll(cCollection);
                        CurrCollection._photoPosts =  CurrCollection.getPage(0,CurrCollection._photoPosts.length);
                        CurrCollection.save();
                        let ind = 0;
                        CurrCollection._photoPosts.forEach(function (item, i, p)
                        {
                            cView.addPhotopost(item,ind);
                            ind++;
                        });
                        c.makeControllerToEdit();
                        c.makeControllerDelete();
                        c.makeControllerLikes();
                    }
                    else
                    {
                    if (value[0] === '#') {
                        let hashtags = value.split(' ');
                        CurrCollection.removeAll();
                        CurrCollection.addAll(new PostCollection(cCollection.getPage(0, cCollection.getLength(), {hashTags: hashtags})));
                        //CurrCollection._photoPosts =  CurrCollection.getPage(0,CurrCollection._photoPosts.length);
                        CurrCollection.save();
                        let ind = 0;
                        CurrCollection._photoPosts.forEach(function (item, i, p)
                        {
                            cView.addPhotopost(item,ind);
                            ind++;
                        });
                        if(CurrCollection.getLength()!=0)
                        {
                            c.makeControllerToEdit();
                            c.makeControllerDelete();
                            c.makeControllerLikes();
                        }
                    } else {
                        CurrCollection.removeAll();
                        CurrCollection.addAll(new PostCollection(cCollection.getPage(0, cCollection.getLength(), {author: value})));
                        CurrCollection.save();
                        let ind = 0;
                        CurrCollection._photoPosts.forEach(function (item, i, p) {
                            cView.addPhotopost(item,ind);
                            ind++;
                        });
                        if(CurrCollection.getLength()!=0)
                        {
                            c.makeControllerToEdit();
                            c.makeControllerDelete();
                            c.makeControllerLikes();
                        }
                    }
                    }
            }
            }
        };
            let search = document.getElementById('search');
            search.addEventListener('click', handle);

    };
    makeControllerToAdd()
    {
        let cView = this.view;
        let elementAdd = document.getElementById("Add");
        let elementMain = document.getElementById("Main");
        let elementLog = document.getElementById("Login");
        let img = document.getElementById('iAdd');
        let c = this;
        let handle = function()
        {
            if(cView.ifAuthorization)
            {
                img.setAttribute('src',"");
                elementAdd.style.display = "block";
                elementMain.style.display = "none";
            }
            else
            {
                elementLog.style.display = "block";
                elementMain.style.display = "none";
                c.makeControllerLogin();
            }
        };
        let plus = document.getElementById('Plus');
        plus.addEventListener('click', handle);
    }
    makeControllerAdd()
    {
        let cView = this.view;
        let cCollection = this.collection;
        let cCurrentCollection = this.currentCollection;
        let elementAdd = document.getElementById("Add");
        let elementMain = document.getElementById("Main");
        let elementLabel = document.getElementById("labelFileA");
        let elementInput = document.getElementById("fileLinkR");
        let elementDes = document.getElementById("description");
        let elementErS = document.getElementById("ErrorAdd");
        let c = this;
        let handle2 = function()
        {
            elementAdd.style.display = "none";
            elementMain.style.display = "block";
            bAdd.disabled = "disabled";
            elementLabel.innerText = "Choose file";
            elementDes.innerText="";
            if(elementInput.files[0]!=undefined)
            {
                elementInput.files[0].name = "";
            }
        };
        let handle1 = function()
        {
                let value = elementDes.value;
                let photopost =
                    {

                        description:'',
                        hashTags: [],
                        likes: []
                    };
                photopost.id = cCollection.getLength().toString();
                let hashtagsAndDes = value.split(' ');
                hashtagsAndDes.forEach(function (item) {
                   if(item[0]==='#')
                   {
                       photopost.hashTags.push(item);
                   }
                   else
                   {
                       photopost.description = photopost.description+' '+ item;
                   }
                });

                photopost.createdAt = new Date();
                photopost.author = cView.username;
                photopost.photoLinkAuthor = 'Dpunk.jpg';//пока так потом будем брать с сервера
                photopost.photoLink = elementLabel.innerText;

                if(cCollection.add(photopost))
                {
                    cView.removeAll(cCurrentCollection.getLength());
                    cCurrentCollection.add(photopost);
                    cCurrentCollection._photoPosts =  cCurrentCollection.getPage(0,cCurrentCollection._photoPosts.length);
                    cCollection._photoPosts =  cCollection.getPage(0,cCollection._photoPosts.length);
                    cCurrentCollection.save();
                    cCollection.saveCol();
                    let ind = 0;
                    cCurrentCollection._photoPosts.forEach(function (item, i, p)
                    {
                        cView.addPhotopost(item,ind);
                        ind++;
                    });
                    c.makeControllerToEdit();
                    c.makeControllerDelete();
                    c.makeControllerLikes();
                    elementAdd.style.display = "none";
                    elementMain.style.display = "block";
                }
                else
                {
                    elementAdd.style.display = "none";
                    elementErS.style.display = "block";
                }
            bAdd.disabled = "disabled";
            elementLabel.innerText = "Choose file";
        };
        let bAdd = document.getElementById("bAdd");
        let toMain = document.getElementById("toMain");
        bAdd.addEventListener('click',handle1);
        toMain.addEventListener('click', handle2);
    }
    makeControllerToEdit()
    {
        let tape = document.getElementById("tape");
        let elements = document.querySelectorAll("[id='pen']");
        let elementRedact = document.getElementById("redact");
        let elementMain = document.getElementById("Main");
        //let v = this.toEdit;
        let c = this;
        let handle = function(event)
        {
            elementRedact.style.display = "block";
            elementMain.style.display = "none";
            let fr = document.createDocumentFragment();
            let node = event.target.parentElement.cloneNode(true);
            fr.appendChild(node); //
            c.makeControllerEdit(fr);
        };
        elements.forEach(function f(item) {
            item.addEventListener('click',handle);
        });
    }
    makeControllerEdit(Node)
    {
        this.makeControllerInputR();
        let cC = this.currentCollection;
        let C = this.collection;
        let cView = this.view;
        let c = this;
        let elementRedact = document.getElementById("redact");
        let elementMain = document.getElementById("Main");
        let elementDescription = document.getElementById("descript");
        let img = document.getElementById('iredact');
        img.setAttribute('src',cC._photoPosts[Node.getElementById("PhotoA").getAttribute("data-id")].photoLink);
        let str="";
        cC._photoPosts[Node.getElementById("PhotoA").getAttribute("data-id")].hashTags.forEach(function(item)
        {
            str = str+item+" ";
        });
        elementDescription.value  = str + cC._photoPosts[Node.getElementById("PhotoA").getAttribute("data-id")].description;
        let handle2 = function()
        {
            elementRedact.style.display = "none";
            elementMain.style.display = "block";
        };
        let handle1 = function()
        {
            let ind = Node.getElementById("PhotoA").getAttribute("data-id");
            let hashtagsAndDes =  elementDescription.value.split(' ');
            cC._photoPosts[ind].hashTags =[];
            cC._photoPosts[ind].description = "";
            hashtagsAndDes.forEach(function (item) {
                if(item[0]==='#')
                {
                    cC._photoPosts[ind].hashTags.push(item);
                }
                else
                {
                    cC._photoPosts[ind].description = cC._photoPosts[ind].description+" " +item;
                }
                cC._photoPosts[ind].photoLink = img.getAttribute("src");
            });
            cC.save();
            C.edit(cC._photoPosts[ind].id,cC._photoPosts[ind]);
            C.saveCol();
            cView.editPhotopost(Node.getElementById("PhotoA").getAttribute("data-id"),cC._photoPosts[Node.getElementById("PhotoA").getAttribute("data-id")]);
            c.makeControllerToEdit();
            c.makeControllerLikes();
            c.makeControllerDelete();
            elementRedact.style.display = "none";
            elementMain.style.display = "block";
        };
        let bAccepted = document.getElementById("accepted");
        let toMain = document.getElementById("toMainFromR");
        toMain.addEventListener('click', handle2);
        bAccepted.addEventListener('click',handle1);
    }
    makeControllerInput()
    {
        let elementLabel = document.getElementById("labelFileA");
        let elementInput = document.getElementById("fileLinkA");
        let img = document.getElementById('iAdd');
        let bAdd = document.getElementById("bAdd");
        let handle = function()
        {
            elementLabel.innerText = elementInput.files[0].name;
            img.setAttribute('src',elementInput.files[0].name);
            bAdd.disabled = "";
            elementInput.value = "";
            elementInput.addEventListener('change',handle);
        };
        elementInput.addEventListener('change',handle);
    }
    makeControllerInputR()
    {
        let elementLabel = document.getElementById("labelFileR");
        let elementInput = document.getElementById("fileLinkR");
        let img = document.getElementById('iredact')
        let handle = function()
        {
            elementLabel.innerText = elementInput.files[0].name;
            img.setAttribute('src',elementInput.files[0].name);
            elementInput.value = "";
        };
        elementInput.addEventListener('change',handle);
    }
    makeControllerErrorL()
    {
    let elementEr = document.getElementById("ErrorLog");
    let elementMain = document.getElementById("Main");
    let elementLog = document.getElementById("Login");
    const ifAuthorization = this.view.ifAuthorization;
    let handle = function()
    {
        elementEr.style.display = "none";
        if(ifAuthorization)
        {
            elementMain.style.display = "block";
        }
        else
        {
            elementLog.style.display = "block";
        }
    };
    let er = document.getElementById('erL');
    er.addEventListener('click', handle);
}
    makeControllerErrorA()
    {
        let elementEr = document.getElementById("ErrorAdd");
        let elementMain = document.getElementById("Main");
        let elementLog = document.getElementById("Login");
        const ifAuthorization = this.view.ifAuthorization;
        let handle = function()
        {
                elementEr.style.display = "none";
                elementMain.style.display = "block";
        };
        let er = document.getElementById('erA');
        er.addEventListener('click', handle);
    }
    makeControllerDelete()
    {
        let cC = this.currentCollection;
        let C = this.collection;
        let V = this.view;
        let elements = document.querySelectorAll("[id='rubbish']");
        let handle = function(event) {
            let fr = document.createDocumentFragment();
            let node = event.target.parentElement.cloneNode(true);
            fr.appendChild(node);
            let ind = fr.getElementById("PhotoA").getAttribute("data-id");
            C.remove(cC._photoPosts[ind].id);
            cC.removeMain(ind);
            V.removePhotopost(ind);
            cC.save();
            C.saveCol();
        };
        elements.forEach(function f(item)
        {
            item.addEventListener('click', handle);
        });
    }
    makeControllerLikes()
    {
        let th = this;
        let cV = this.view;
        let C = this.collection;
        let cC = this.currentCollection;
        let elementMain = document.getElementById("Main");
        let elementLog = document.getElementById("Login");
        let elements = document.querySelectorAll("[id='like']");
        let handle = function(event)
        {
            if(cV.ifAuthorization)
            {
                let fr = document.createDocumentFragment();
                let node = event.target.parentElement.parentElement.parentElement.cloneNode(true);
                fr.appendChild(node);
                let ind = fr.getElementById('PhotoA').getAttribute('data-id');
                if (cC._photoPosts[ind].likes.indexOf(cV.username) == -1) {
                    cC._photoPosts[ind].likes.push(cV.username);
                    cV.editPhotopost(ind, cC._photoPosts[ind]);
                    C.edit(cC._photoPosts[cC._photoPosts[ind].id], cC._photoPosts[ind]);
                    cC.save();
                    C.saveCol();
                    th.makeControllerToEdit();
                    th.makeControllerDelete();
                } else {
                    let i = cC._photoPosts[ind].likes.indexOf((cV.username));
                    cC._photoPosts[ind].likes.splice(i, 1);
                    cV.editPhotopost(ind, cC._photoPosts[ind]);
                    C.edit(cC._photoPosts[cC._photoPosts[ind].id], cC._photoPosts[ind]);
                    cC.save();
                    C.saveCol();
                    th.makeControllerToEdit();
                    th.makeControllerDelete();

                }
                th.makeControllerLikes();
            }
            else
            {
                elementLog.style.display = "block";
                elementMain.style.display = "none";
                th.makeControllerLogin();
            }
        };
        elements.forEach(function f(item)
        {
            item.addEventListener('click', handle);
        });
    }

}
class ViewPage
{
    constructor()
    {
        this.options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        this.username = "";
        this.ifAuthorization = false;
    }
    static save(username)
    {
        localStorage.setItem('username', JSON.stringify(username));
    }
   authorization(user)
    {
        if(user!=undefined) {
            if (user.name != undefined && user.picture != undefined) {
                    const username = this.username;
                    const template = document.getElementById('NameOfuser');
                    const templateAva = document.getElementById('AvatarOfuser');
                    let newName = document.importNode(template.content, true);
                    let newAva = document.importNode(templateAva.content, true);
                    newName.getElementById('dnameOfuser').innerText = user.name;
                    newAva.getElementById('avatarOfuser').setAttribute("src", user.picture);
                    const nameCont = document.getElementById('nameContainer');
                    const avatarCont = document.getElementById('avatarContainer');
                    nameCont.removeChild(nameCont.lastChild);
                    avatarCont.removeChild(avatarCont.lastChild);
                    document.getElementById('nameContainer').appendChild(newName);
                    document.getElementById('avatarContainer').appendChild(newAva);
                    if (this.username != user.name) {
                        let Tape = document.getElementById('tape');
                        let posts = document.getElementsByClassName('layout-post');
                        let postsArray = Array.from(posts);
                        postsArray.forEach(function (item) {
                            if (item.getElementsByTagName("span")[0].innerHTML == username) {
                                let pen = item.getElementsByTagName('img')[2];
                                pen.style.display = "none";
                                let rubbish = item.getElementsByTagName('img')[3];
                                rubbish.style.display = "none";
                            }
                            if (item.getElementsByTagName("span")[0].innerHTML == user.name) {
                                let pen = item.getElementsByTagName('img')[2];
                                pen.style.display = "";
                                let rubbish = item.getElementsByTagName('img')[3];
                                rubbish.style.display = "";
                            }
                        });
                    }
                this.username = user.name.slice();
                if (user.name === "")
                {
                    this.ifAuthorization = false;
                }
                else
                    {
                    this.ifAuthorization = true;
                    }
            }
        }
        else
        {
           const template = document.getElementById('NameOfuser');
           const templateAva = document.getElementById('AvatarOfuser');
           let newName = document.importNode(template.content, true);
           newName.getElementById('dnameOfuser').innerText = "";
           let newAva = document.importNode(templateAva.content, true);
           newAva.getElementById('avatarOfuser').setAttribute("src","empty.png");
            document.getElementById('nameContainer').appendChild(newName);
            document.getElementById('avatarContainer').appendChild(newAva);
           this.username = "";
           this.ifAuthorization = false;
        }
    }
    addPhotopost(photopost,i)
    {
        const template = document.getElementById('layout-post-template');
        let newPhotopost = document.importNode(template.content,true);
        newPhotopost.getElementById('nameAuthor').innerText = photopost.author;
        if(this.username!=photopost.author)
        {
            newPhotopost.getElementById('pen').style.display="none";
            newPhotopost.getElementById('rubbish').style.display="none";
        }
        newPhotopost.getElementById('Photo').setAttribute("src",photopost.photoLink);
        newPhotopost.getElementById('PhotoA').setAttribute("data-id",i);
        newPhotopost.getElementById('PhotoA').setAttribute("src",photopost.photoLinkAuthor);
        newPhotopost.getElementById('date').innerText = photopost.createdAt.toLocaleString("ru", this.options);
        let str ="";
        photopost.hashTags.forEach(function(item)
        {
           str = str+item+" ";
        });
        newPhotopost.getElementById('info&hTags').innerText = str + photopost.description;
        str = "❤"+photopost.likes.length;
        newPhotopost.getElementById('likess').innerText=str;
        document.getElementById('tape').appendChild(newPhotopost);

    }
    addAll(collection)
    {
        const view = this;
        let i =0;
        collection._photoPosts.forEach(function (item) {
           view.addPhotopost(item,i);
          i++;
        });
    }

    editPhotopost(id,photopost)
    {
        let Tape = document.getElementById('tape');
        let posts = document.getElementsByClassName('layout-post');
        let postsArray = Array.from(posts);
       // console.log(postsArray);
        const template = document.getElementById('layout-post-template');
        let post = document.importNode(template.content, true);
        post.getElementById('PhotoA').setAttribute("data-id",id);
        if(this.username!=photopost.author)
        {
            post.getElementById('pen').style.display = "none";
            post.getElementById('rubbish').style.display = "none";
        }
        if(!this.editInner('nameAuthor',photopost.author,post))
        {
            let str = postsArray[id].getElementsByTagName("span")[0].innerHTML;
            this.editInner('nameAuthor',str,post);
        }
        if(!this.editAttribute('Photo',photopost.photoLink,post))
        {
            let str = postsArray[id].getElementsByTagName('img')[1].getAttribute('src');
            this.editAttribute('Photo',str,post)
        }
        if(!this.editAttribute('PhotoA',photopost.photoLinkAuthor,post))
        {
            let str = postsArray[id].getElementsByTagName('img')[0].getAttribute('src');
            this.editAttribute('PhotoA',str,post)
        }
        if(!this.editDate(photopost.createdAt,post))
        {
            let str = postsArray[id].getElementsByTagName("span")[1].innerHTML;
            this.editInner('date', str, post);
        }
        if(!this.editHashtagsDescription(photopost.hashTags,photopost.description,post))
        {
            let str = postsArray[id].getElementsByTagName("div")[8].innerHTML;
            this.editInner('info&hTags',str,post);
        }
        if(!this.editLikes(photopost.likes,post))
        {
            let str = postsArray[id].getElementsByTagName('span')[2].innerHTML;
            this.editInner('likes', str, post);
        }
        //post.getElementById('likes').innerText="❤0";
        Tape.replaceChild(post,postsArray[id]);

    }
    editDate(edition,node)
    {
        if(edition!=undefined)
        {
            let date = new Date(edition).toLocaleString("ru", this.options);;
            this.editInner('date', date, node);
            return true;
        }
        return false;
    }
    editHashtagsDescription(editionH,editionD,node)
    {
        let str="";
        let ind = false;
        if(editionH!=undefined)
        {
            editionH.forEach(function (item) {
                str = str + item + " ";
            });
           ind =true;
        }
        if(editionD!=undefined)
        {
            str = str + editionD;
            ind = true;
        }
        if(ind)
        {
            this.editInner('info&hTags', str, node);
            return true;
        }
        return false;
    }
    editLikes(edition,node)
    {
        if(edition!=undefined)
        {
            let likes = "❤"+edition.length;
            this.editInner('likes',likes, node);
            return true;
        }
        return false;
    }
    editAttribute(id,edition,node)
    {
        if(edition!=undefined)
        {
            node.getElementById(id).setAttribute("src", edition);
            return true;
        }
        return false;
    }
    editInner(id,edition,node)
    {
        if(edition!=undefined)
        {
                    node.getElementById(id).innerText = edition;
                    return true;
        }
        return false;
    }
    removePhotopost(id)
    {
        let Tape = document.getElementById('tape');
        let posts = document.getElementsByClassName('layout-post');
        let postsArray = Array.from(posts);
        Tape.removeChild(postsArray[id]);
    }
    removeAll(startSize)
    {
        let Tape = document.getElementById('tape');
        let posts = document.getElementsByClassName('layout-post');
        let postsArray = Array.from(posts);
        for(let i = 0; i<startSize;i++)
        {
            Tape.removeChild(postsArray[i]);
        }
    }
    filter(str)
    {
        const template = document.getElementById('Filter');
        let newFilter = document.importNode(template.content,true);
        newFilter.getElementById('filter').setAttribute("value","may be "+str);
        document.getElementById('FFilter').appendChild(newFilter);
    }
}
class PostCollection {

    constructor(photoPosts)
    {
        this._photoPosts = (photoPosts.slice() || []);
        this.length = this._photoPosts.length;
    }
    save()
    {
        localStorage.setItem('currentCollection', JSON.stringify(this._photoPosts));
    }
    saveCol()
    {
        localStorage.setItem('photoPosts', JSON.stringify(this._photoPosts));
    }
    static restore()
    {
        let  p = new PostCollection([
            {
                id: '0',
                description: 'Джанго',
                createdAt: new Date('2017-02-21T21:00:00'),
                author: 'Semenov',
                photoLink: 'realman.jpg',
                photoLinkAuthor: 'Dpunk.jpg',
                hashTags: ['#лучший', '#туда его'],
                likes: []//['Ann', 'Егор','g','a'],
            },
            {
                id: '1',
                description: 'Джанго2',
                createdAt: new Date('2019-02-22T22:00:00'),
                author: 'Egor',
                photoLink: 'realman.jpg',
                photoLinkAuthor: 'Dpunk.jpg',
                hashTags: ['#лучший', '#туда егоо'],
                likes: []/*['Ann', 'Егор']*/
            },
            {
                id: '2',
                description: 'Джангоо',
                createdAt: new Date('2018-02-23T23:00:00'),
                author: 'EgorSemenov',
                photoLink: 'realman.jpg',
                photoLinkAuthor: 'Dpunk.jpg',
                hashTags: ['#мгла', '#горнолыжник'],
                likes: []//['God', 'Tarantino']
            },
        ]);
        p._photoPosts = p.getPage(0,p._photoPosts.length);
        localStorage.setItem('photoPosts', JSON.stringify(p._photoPosts));

 }
 getLength()
 {
     return this.length;
 }
 getPage(skip = 0, top = 10, filterConfig)
 {
     let photoPostsFiltered = this._photoPosts.slice(0,this.length);

     if (filterConfig != undefined)
     {
         if (filterConfig.author != undefined)
         {
             photoPostsFiltered = photoPostsFiltered.filter(post => post.author === filterConfig.author);
         }

         if (filterConfig.createdAt != undefined)
         {
             photoPostsFiltered = photoPostsFiltered.filter(post => post.createdAt.getTime() === filterConfig.createdAt.getTime());
         }

         if (filterConfig.hashTags != undefined)
         {
             photoPostsFiltered = photoPostsFiltered.filter(post => filterConfig.hashTags.every(hashTag => post.hashTags.includes(hashTag)));
         }
     }

     photoPostsFiltered.sort(function (a, b)
     {
         return new Date(b.createdAt) - new Date(a.createdAt);
     });

     photoPostsFiltered = photoPostsFiltered.slice(skip,skip+top);
     return photoPostsFiltered;
 }

 get(id)
 {
     return this._photoPosts.find(post => post.id === id);
 }
 getInd(id)
 {
     return this._photoPosts.find(post => post.id === id).indexOf();
 }
 static validate(photoPost)
 {
     if (photoPost === undefined)
     {
         return false;
     }

     let TYPESTRING = '[object String]';
     let TYPEDATE = '[object Date]';
     let TYPEOBJECT = '[object Array]';
     let toString = {}.toString;
     return 	((TYPESTRING === toString.call(photoPost.id))&&
     (TYPESTRING === toString.call(photoPost.description))&&
     (TYPESTRING === toString.call(photoPost.author))&&
     (TYPEDATE === toString.call(photoPost.createdAt))&&
     (photoPost.createdAt != 'Invalid Date')&&
     (TYPESTRING === toString.call(photoPost.photoLink))&&
     (TYPESTRING === toString.call(photoPost.photoLinkAuthor))&&
     (TYPEOBJECT === toString.call(photoPost.hashTags))&&
         (TYPEOBJECT === toString.call(photoPost.likes)));
 }

 add(photoPost)
 {
     if(PostCollection.validate(photoPost))
     {
         this._photoPosts.push(photoPost);
         this.length++;
         return true;
     }

     return false;
 }

 addAll(photoPosts)
 {
     let invalidPosts = [];
     let col = this;
     photoPosts._photoPosts.forEach(function (phPost)
     {
         if (!col.add(phPost))
         {
             invalidPosts.push(phPost);
         }
     });
        return invalidPosts;
    }

    edit(id, photoPost)
    {
        let index = this._photoPosts.findIndex(post => post.id == id);

        if(index === -1)
        {
            return false;
        }

        if(photoPost.description != undefined)
        {
            let TYPESTRING = '[object String]';
            let toString = {}.toString;

            if (TYPESTRING === toString.call(photoPost.description))
            {
                this._photoPosts[index].description = photoPost.description;
            }
            else
            {
                return false;
            }
        }

        if(photoPost.photoLink != undefined)
        {
            let TYPESTRING = '[object String]';
            let toString = {}.toString;

            if(TYPESTRING === toString.call(photoPost.photoLink))
            {
                this._photoPosts[index].photoLink = photoPost.photoLink;
            }
            else
            {
                return false;
            }
        }
        if(photoPost.photoLinkAuthor != undefined)
        {
            let TYPESTRING = '[object String]';
            let toString = {}.toString;

            if(TYPESTRING === toString.call(photoPost.photoLinkAuthor))
            {
                this._photoPosts[index].photoLinkAuthor = photoPost.photoLinkAuthor;
            }
            else
            {
                return false;
            }
        }

        if(photoPost.hashTags != undefined)
        {
            let TYPEOBJECT = '[object Array]';
            let toString = {}.toString;

            if(TYPEOBJECT === toString.call(photoPost.hashTags))
            {
                this._photoPosts[index].hashTags = photoPost.hashTags;
            }
            else
            {
                return false;
            }
        }

        return true;
    }
    removeMain(id)
    {
      this._photoPosts.splice(id,1);
      this.length--;
    }
    remove(id)
    {
        let tempId = this._photoPosts.findIndex(post => post.id === id);

        if(tempId === -1)
        {
            return false;
        }

        this._photoPosts.splice(tempId, 1);
        this.length--;
        return true;
    }
    removeAll()
    {
        this._photoPosts.length = 0;
        this.length = 0;
    }
}

PostCollection.restore();
window.onload = function() {
    let c = new ControllerFotoshark();
   c.makeControllers();
};




