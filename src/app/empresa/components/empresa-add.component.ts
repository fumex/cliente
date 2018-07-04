import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../services/empresa.service';

@Component({
    selector:'empresa-add',
    templateUrl:'../views/empresa-add.html',
    providers:[EmpresaService]
})
export class EmpresaAddComponent implements OnInit{

    public title:string;
    imageUrl:string="/assets/images/2.png";
    fileToUpload:File=null;
    constructor(
        private empresaService:EmpresaService
    ){
        this.title='Insertar Empresa';
    }
    ngOnInit(){
    }

    handleFileInput(file:FileList){

        this.fileToUpload= file.item(0);
        //mostrar imagen
        var reader= new FileReader();
        reader.onload=(event:any)=>{
            this.imageUrl = event.target.result;
        }
        reader.readAsDataURL(this.fileToUpload);
        
        
    }

    onSubmit(Caption,Image){
        this.empresaService.postFile(Caption.value,this.fileToUpload).subscribe(
            data=>{
                console.log(data);
                Caption.value=null;
                Image.value=null;
                this.imageUrl="/assets/images/2.png";
            },
            error=>{
                console.log(<any>error);
            }
        );
    }
}