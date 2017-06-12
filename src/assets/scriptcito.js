
var dateedg = document.getElementsByClassName("o_form_field_date o_form_field")[1].textContent;

debugger;
                    
                        function getAge(dateString) {
                           var today = new Date();
                           var birthDate = new Date(dateString);
                           var age = today.getFullYear() - birthDate.getFullYear();
                           var m = today.getMonth() - birthDate.getMonth();
                           
                            if (  birthDate.getDate() > today.getDate()) {
                                if(0 >= m ){
                                age--;
                                }
                            }
                           
                           return age;
                        }
                         alert(getAge(dateedg));
