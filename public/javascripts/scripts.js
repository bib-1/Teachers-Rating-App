function confirmAlert(){
    if(confirm(`Do you want to delete this data from the list?`)){
}
else{
    event.stopPropagation();
    event.preventDefault();
}
}