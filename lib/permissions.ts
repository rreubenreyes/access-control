export enum Permission {
    FindOne, // The actor may request exactly one of a resource
    FindMany, // The actor may request many of one resource 
    Create, // The actor may create a resource
    Update, // The actor may update a resource
    Delete, // The actor may delete a resouce
}
