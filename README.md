# Checkpoint 4 Web Development

## Integrantes 👋
<ul>
    <li>Gabriel Barros (RM556309)</li>  
    <li>João Marcelo Furtado Romero (RM555199)</li>
    <li>Kayky Silva Stiliano (RM555148)</li>
    <li>Pedro Henrique Bizzo de Santana (RM557263)</li>
    <li>Pedro Henrique Mendes Dos Santos (RM555332)</li>
</ul>

## Dependências 📦
<ul>
    <li>Bootstrap</li>
    <li>Font Awesome</li>
</ul>
 
<br>

## Explicando o Código 🧑‍💻
Visão geral:

<br>

Links e scripts externos:
<ul>
    <li> <link href="...">: Inclui as bibliotecas externas de Bootstrap e Font Awesome, que fornecem estilos e ícones predefinidos, além de trazer os estilos de cada respectiva página</li>
    <li> <script src="...">: Inclui o JavaScript do Bootstrap para funcionalidades interativas além de trazer os arquivos individuais de cada respectiva página.</li>
</ul>

Navegação (Navbar): 
<ul>
    <li>A tag <nav> contém a barra de navegação com o nome "Eco Trend", o botão para a página de administração e o ícone do carrinho de compras com um contador de itens (classe cart-counter).</li>
</ul>

Filtro de preço e lista de produtos:
<ul>
    <li>A página usa um <select> para filtrar produtos por preço (mais caro ou mais barato).</li>
    <li>A lista de produtos é gerada dinamicamente dentro da div com id productList.</li>
</ul>

Modais:
<ul>
    <li>Vários modais são usados para mostrar janelas emergentes, como o carrinho de compras (#cartModal), a experiência de avaliação de compra (#reviewModal), e uma mensagem de agradecimento pós-compra (#thankYouModal). Estes modais são estruturados com cabeçalhos,     
        conteúdo principal, e rodapés que incluem botões de ação.
    </li>
</ul>

Página de checkout: 
<ul>
    <li>A página de checkout exibe um resumo do pedido e detalhes de pagamento. O formulário de pagamento inclui campos para informações do cartão de crédito e, ao ser enviado, realiza a compra.</li>
</ul>

Página de administração: 
<ul>
    <li>A página de administração permite adicionar novos produtos. O formulário contém campos para o nome, preço e URL da imagem do produto, além de um checkbox para adicionar produtos sem imagem.
    Botões como "Add Product" (para adicionar) e "Cancel Edit" (para cancelar edições) estão presentes.
    Produtos atuais são listados dinamicamente na div com id productList.
    </li>
</ul>
        
<br>













