

export default function authorize(abilities) {

    let permissions = window.user.permissions

    if(!permissions) {
        return false
    }

    if(Array.isArray(abilities)){
        return permissions.filter(abiltiy => abilities.includes(abiltiy)).length > 0;
    }

    return permissions.includes(abilities);
}
